/**
 * Data Science Digital Library - Pyodide Python Runner
 * Client-side WebAssembly Python execution engine.
 * Handles standard input, stdout/stderr capture, Matplotlib plotting, and package loading.
 */

class PyodideRunner {
  constructor() {
    this.pyodide = null;
    this.status = "uninitialized"; // 'uninitialized' | 'loading' | 'ready' | 'running' | 'completed' | 'error'
    this.statusMessage = "Python: Not Loaded";
    this.loadedPackages = new Set();
    this.listeners = new Set();
    this.initPromise = null;
  }

  onStatusChange(callback) {
    this.listeners.add(callback);
    callback(this.status, this.statusMessage);
    return () => this.listeners.delete(callback);
  }

  notify(status, message) {
    this.status = status;
    this.statusMessage = message;
    this.listeners.forEach(cb => {
      try { cb(status, message); } catch (e) { console.error(e); }
    });
  }

  async init() {
    if (this.pyodide) return this.pyodide;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.notify("loading", "Python Runtime: Loading WebAssembly...");

      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
          s.onload = resolve;
          s.onerror = () => reject(new Error("Unable to load Pyodide from CDN"));
          document.head.appendChild(s);
        });
      }

      this.notify("loading", "Python Runtime: Initializing...");
      this.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });

      this.notify("ready", "Python Runtime: Ready");
      return this.pyodide;
    })().catch(err => {
      this.notify("error", `Python Runtime Error: ${err.message}`);
      this.initPromise = null;
      throw err;
    });

    return this.initPromise;
  }

  detectPackages(code) {
    const pkgs = [];
    const checks = [
      { pkg: "numpy", re: /\b(import\s+numpy|from\s+numpy)\b/ },
      { pkg: "pandas", re: /\b(import\s+pandas|from\s+pandas)\b/ },
      { pkg: "matplotlib", re: /\b(import\s+matplotlib|from\s+matplotlib)\b/ },
      { pkg: "scipy", re: /\b(import\s+scipy|from\s+scipy)\b/ },
      { pkg: "seaborn", re: /\b(import\s+seaborn|from\s+seaborn)\b/ }
    ];
    checks.forEach(c => {
      if (c.re.test(code) && !this.loadedPackages.has(c.pkg)) {
        pkgs.push(c.pkg);
      }
    });
    return pkgs;
  }

  async ensurePackages(code) {
    await this.init();
    const needed = this.detectPackages(code);
    if (needed.length > 0) {
      this.notify("loading", `Loading packages (${needed.join(", ")})...`);
      for (const pkg of needed) {
        try {
          await this.pyodide.loadPackage(pkg);
          this.loadedPackages.add(pkg);
        } catch (e) {
          console.warn(`Package ${pkg} load error:`, e);
        }
      }
      this.notify("ready", "Python Runtime: Ready");
    }
  }

  async run(code, stdinText = "") {
    await this.ensurePackages(code);
    this.notify("running", "Running...");

    const tStart = performance.now();

    this.pyodide.globals.set("_USER_CODE", code);
    this.pyodide.globals.set("_USER_STDIN", stdinText || "");

    const runnerHarness = `
import sys, io, time, traceback, base64

__orig_stdin = sys.stdin
__orig_stdout = sys.stdout
__orig_stderr = sys.stderr

__stdout_io = io.StringIO()
__stderr_io = io.StringIO()
sys.stdin = io.StringIO(_USER_STDIN)
sys.stdout = __stdout_io
sys.stderr = __stderr_io

__plots = []
__has_error = False
__tb_str = ""

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.close("all")
except Exception:
    pass

try:
    __globals = {"__name__": "__main__"}
    exec(_USER_CODE, __globals)
except Exception:
    __has_error = True
    __tb_str = traceback.format_exc()
finally:
    try:
        import matplotlib.pyplot as plt
        for __fignum in plt.get_fignums():
            __fig = plt.figure(__fignum)
            __buf = io.BytesIO()
            __fig.savefig(__buf, format="png", bbox_inches="tight", dpi=140)
            __buf.seek(0)
            __plots.append(base64.b64encode(__buf.read()).decode("ascii"))
        plt.close("all")
    except Exception:
        pass

    sys.stdin = __orig_stdin
    sys.stdout = __orig_stdout
    sys.stderr = __orig_stderr

__result = {
    "stdout": __stdout_io.getvalue(),
    "stderr": __stderr_io.getvalue(),
    "has_error": __has_error,
    "traceback": __tb_str,
    "plots": __plots
}
__result
`;

    let resultProxy = null;
    try {
      resultProxy = await this.pyodide.runPythonAsync(runnerHarness);
      const res = resultProxy.toJs({ dict_converter: Object.fromEntries });
      const durationSec = (performance.now() - tStart) / 1000;

      this.notify("completed", "Execution completed");

      return {
        stdout: res.stdout || "",
        stderr: res.stderr || "",
        hasError: !!res.has_error,
        traceback: res.traceback || "",
        executionTimeSec: parseFloat(durationSec.toFixed(2)),
        plots: Array.isArray(res.plots) ? res.plots : []
      };
    } catch (jsError) {
      this.notify("error", "Execution error");
      const durationSec = (performance.now() - tStart) / 1000;
      return {
        stdout: "",
        stderr: jsError.message || String(jsError),
        hasError: true,
        traceback: jsError.stack || jsError.message || String(jsError),
        executionTimeSec: parseFloat(durationSec.toFixed(2)),
        plots: []
      };
    } finally {
      if (resultProxy && typeof resultProxy.destroy === "function") {
        resultProxy.destroy();
      }
    }
  }
}

// Global instance
window.pyodideRunner = new PyodideRunner();
