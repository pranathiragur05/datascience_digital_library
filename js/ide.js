/**
 * Data Science Digital Library - LeetCode-style Interactive IDE
 * Monaco Editor + Pyodide WebAssembly execution + Test Cases + Persistence.
 */

(function () {
  const STORAGE_KEY = "datascience-library-workspace-v1";

  class ExperimentIDE {
    constructor() {
      this.editor = null;
      this.monaco = null;
      this.models = new Map(); // expId -> monaco ITextModel
      this.viewStates = new Map(); // expId -> editor view state
      this.loadingMonaco = false;

      this.state = {
        openTabs: [],
        activeId: null,
        userCode: {},
        userInput: {},
        outputs: {},
        testResults: {},
        activeDock: "console", // 'input' | 'console' | 'tests'
        searchQuery: "",
        selectedCategory: "All",
        sidebarOpen: false
      };

      this.loadStorage();
    }

    loadStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.openTabs)) {
            Object.assign(this.state, parsed);
          }
        }
      } catch (e) {
        console.warn("Storage load warning:", e);
      }

      const all = this.getAllExperiments();
      if (!this.state.openTabs || this.state.openTabs.length === 0) {
        const first = all[0] ? all[0].id : "exp-1a";
        this.state.openTabs = [first];
        this.state.activeId = first;
      } else if (!this.state.activeId || !this.state.openTabs.includes(this.state.activeId)) {
        this.state.activeId = this.state.openTabs[0];
      }
    }

    saveStorage() {
      try {
        // Collect current code from models
        this.models.forEach((model, id) => {
          this.state.userCode[id] = model.getValue();
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn("Storage save warning:", e);
      }
    }

    getAllExperiments() {
      const base = window.EXPERIMENTS_DATA || [];
      const list = [...base];

      // Also incorporate existing legacy EXPS (4, 5, 6) if not already present
      if (typeof EXPS !== "undefined") {
        [4, 5, 6].forEach(num => {
          const group = EXPS[num];
          if (group && group.subs) {
            group.subs.forEach((sub, idx) => {
              const letter = String.fromCharCode(97 + idx);
              const id = `exp-${num}${letter}`;
              if (!list.some(e => e.id === id)) {
                let cat = num === 4 ? "Data Wrangling" : num === 5 ? "Data Visualization" : "Time Series";
                list.push({
                  id: id,
                  number: num,
                  part: letter,
                  title: `${num}${letter}. ${sub.t.replace(/^\d+\w\.\s*/, '')}`,
                  category: cat,
                  difficulty: num === 6 ? "Hard" : "Medium",
                  tags: [cat.toLowerCase().replace(/\s+/g, '-'), "python"],
                  description: `Official lab program for <b>${group.t}</b>. Run this code to verify standard output or graphical visualization.`,
                  examples: [],
                  constraints: "Standard Python 3 environment.",
                  learningObjectives: [`Master ${group.t} in Python`],
                  hints: ["Inspect variable states and function parameters."],
                  starterCode: sub.c,
                  expectedOutput: sub.o,
                  defaultInput: "",
                  testCases: []
                });
              }
            });
          }
        });
      }
      return list;
    }

    getExperiment(id) {
      return this.getAllExperiments().find(e => e.id === id) || null;
    }

    async loadMonaco() {
      if (this.monaco) return this.monaco;
      if (this.loadingMonaco) {
        return new Promise(resolve => {
          const check = setInterval(() => {
            if (this.monaco) {
              clearInterval(check);
              resolve(this.monaco);
            }
          }, 50);
        });
      }

      this.loadingMonaco = true;
      return new Promise((resolve, reject) => {
        if (!window.require) {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js";
          s.onload = () => {
            window.require.config({
              paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs" }
            });
            window.require(["vs/editor/editor.main"], () => {
              this.monaco = window.monaco;
              this.loadingMonaco = false;
              resolve(this.monaco);
            });
          };
          s.onerror = () => {
            this.loadingMonaco = false;
            reject(new Error("Unable to load Monaco editor from CDN"));
          };
          document.head.appendChild(s);
        } else {
          window.require(["vs/editor/editor.main"], () => {
            this.monaco = window.monaco;
            this.loadingMonaco = false;
            resolve(this.monaco);
          });
        }
      });
    }

    mount(container) {
      if (!container) return;

      container.innerHTML = `
        <div class="experiment-ide" id="exp-ide-app">
          <!-- Top Problem & Actions Bar -->
          <header class="exp-ide-header">
            <div class="exp-ide-header-left">
              <button class="exp-ide-btn exp-ide-btn-icon" id="exp-ide-toggle-sidebar" title="Browse Experiments" aria-label="Browse Experiments">
                ☰ Experiments
              </button>
              <div class="exp-ide-tabs" id="exp-ide-tabs-bar"></div>
            </div>
            <div class="exp-ide-header-right">
              <span class="exp-ide-runtime-status" id="exp-ide-runtime-badge">
                <span class="dot"></span>
                <span class="label">Python Runtime: Ready</span>
              </span>
              <button class="exp-ide-btn exp-ide-btn-run" id="exp-ide-run-btn" title="Run Code (Ctrl+Enter)">
                ▶ Run
              </button>
              <button class="exp-ide-btn exp-ide-btn-test" id="exp-ide-test-btn" title="Run Unit Test Cases">
                🧪 Test
              </button>
              <button class="exp-ide-btn" id="exp-ide-reset-btn" title="Reset Code to Default">
                ↺ Reset
              </button>
            </div>
          </header>

          <!-- Drawer / Sidebar for Experiment Selector -->
          <aside class="exp-ide-sidebar ${this.state.sidebarOpen ? 'open' : ''}" id="exp-ide-sidebar">
            <div class="exp-ide-sidebar-header">
              <h3>Select Experiment</h3>
              <button class="exp-ide-btn-close" id="exp-ide-sidebar-close" aria-label="Close sidebar">✕</button>
            </div>
            <div class="exp-ide-search">
              <input type="text" id="exp-ide-search-box" placeholder="Search experiments or topics..." value="${escapeHtml(this.state.searchQuery)}">
            </div>
            <div class="exp-ide-categories" id="exp-ide-category-chips"></div>
            <div class="exp-ide-exp-list" id="exp-ide-exp-list"></div>
          </aside>

          <!-- Main LeetCode Split: Problem (Left) & Editor/Console (Right) -->
          <div class="exp-ide-split">
            <!-- Left: Problem Panel -->
            <section class="exp-ide-panel-left" id="exp-ide-problem-panel" aria-label="Problem Description">
              <div class="exp-ide-panel-inner" id="exp-ide-problem-content"></div>
            </section>

            <!-- Right: Code Editor & Bottom Dock -->
            <section class="exp-ide-panel-right">
              <!-- Code Editor Container -->
              <div class="exp-ide-editor-wrapper">
                <div class="exp-ide-editor-header">
                  <span class="lang-tag">Python 3</span>
                  <span class="shortcut-tag">Ctrl + Enter to Run</span>
                </div>
                <div id="exp-ide-monaco-mount" class="exp-ide-monaco-container">
                  <div class="exp-ide-loading">Loading Monaco Editor...</div>
                </div>
              </div>

              <!-- Bottom Dock (Input, Console, Tests) -->
              <div class="exp-ide-dock">
                <div class="exp-ide-dock-tabs">
                  <button class="exp-ide-dock-tab ${this.state.activeDock === 'console' ? 'active' : ''}" data-dock="console">
                    💻 Console / Output
                  </button>
                  <button class="exp-ide-dock-tab ${this.state.activeDock === 'input' ? 'active' : ''}" data-dock="input">
                    ⌨️ Standard Input
                  </button>
                  <button class="exp-ide-dock-tab ${this.state.activeDock === 'tests' ? 'active' : ''}" data-dock="tests">
                    🧪 Test Cases
                  </button>
                  <div class="exp-ide-dock-meta" id="exp-ide-dock-meta"></div>
                </div>

                <div class="exp-ide-dock-body">
                  <!-- Console Output Tab -->
                  <div class="exp-ide-dock-pane ${this.state.activeDock === 'console' ? 'active' : ''}" id="exp-dock-console">
                    <div class="exp-ide-console-output" id="exp-ide-console-body">
                      <div class="exp-ide-placeholder">Click <b>▶ Run</b> to execute your code in Python 3. Output will appear here.</div>
                    </div>
                    <div class="exp-ide-plot-output" id="exp-ide-plot-body"></div>
                  </div>

                  <!-- Standard Input Tab -->
                  <div class="exp-ide-dock-pane ${this.state.activeDock === 'input' ? 'active' : ''}" id="exp-dock-input">
                    <div class="exp-ide-input-container">
                      <label for="exp-ide-stdin-text">Standard Input (passed to <code>input()</code>):</label>
                      <textarea id="exp-ide-stdin-text" spellcheck="false" placeholder="Enter input here (each line corresponds to one input() call)..."></textarea>
                    </div>
                  </div>

                  <!-- Test Cases Tab -->
                  <div class="exp-ide-dock-pane ${this.state.activeDock === 'tests' ? 'active' : ''}" id="exp-dock-tests">
                    <div class="exp-ide-tests-container" id="exp-ide-tests-body"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      `;

      this.bindEvents();
      this.renderTabs();
      this.renderSidebar();
      this.renderProblem();
      this.renderDock();
      this.initMonaco();

      // Subscribe to runtime status
      if (window.pyodideRunner) {
        window.pyodideRunner.onStatusChange((status, message) => {
          const badge = document.getElementById("exp-ide-runtime-badge");
          if (badge) {
            badge.className = `exp-ide-runtime-status ${status}`;
            badge.querySelector(".label").textContent = message;
          }
        });
      }
    }

    bindEvents() {
      // Run Button
      const runBtn = document.getElementById("exp-ide-run-btn");
      if (runBtn) runBtn.onclick = () => this.runCurrentCode();

      // Test Button
      const testBtn = document.getElementById("exp-ide-test-btn");
      if (testBtn) testBtn.onclick = () => this.runUnitTests();

      // Reset Button
      const resetBtn = document.getElementById("exp-ide-reset-btn");
      if (resetBtn) resetBtn.onclick = () => this.resetCurrentCode();

      // Sidebar Toggle & Close
      const toggleBtn = document.getElementById("exp-ide-toggle-sidebar");
      const closeBtn = document.getElementById("exp-ide-sidebar-close");
      const sidebar = document.getElementById("exp-ide-sidebar");
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          this.state.sidebarOpen = !this.state.sidebarOpen;
          if (sidebar) sidebar.classList.toggle("open", this.state.sidebarOpen);
        };
      }
      if (closeBtn) {
        closeBtn.onclick = () => {
          this.state.sidebarOpen = false;
          if (sidebar) sidebar.classList.remove("open");
        };
      }

      // Dock Tabs
      document.querySelectorAll(".exp-ide-dock-tab").forEach(tab => {
        tab.onclick = () => {
          const target = tab.getAttribute("data-dock");
          this.switchDock(target);
        };
      });

      // Search Box
      const searchBox = document.getElementById("exp-ide-search-box");
      if (searchBox) {
        searchBox.oninput = (e) => {
          this.state.searchQuery = e.target.value.toLowerCase().trim();
          this.renderSidebarList();
        };
      }

      // Standard Input blur
      const stdinText = document.getElementById("exp-ide-stdin-text");
      if (stdinText) {
        stdinText.oninput = () => {
          if (this.state.activeId) {
            this.state.userInput[this.state.activeId] = stdinText.value;
            this.saveStorage();
          }
        };
      }
    }

    switchDock(target) {
      this.state.activeDock = target;
      document.querySelectorAll(".exp-ide-dock-tab").forEach(t => {
        t.classList.toggle("active", t.getAttribute("data-dock") === target);
      });
      document.querySelectorAll(".exp-ide-dock-pane").forEach(p => {
        p.classList.remove("active");
      });
      const targetPane = document.getElementById(`exp-dock-${target}`);
      if (targetPane) targetPane.classList.add("active");
      this.saveStorage();
    }

    async initMonaco() {
      const mount = document.getElementById("exp-ide-monaco-mount");
      if (!mount) return;

      try {
        const monaco = await this.loadMonaco();
        mount.innerHTML = "";

        this.editor = monaco.editor.create(mount, {
          language: "python",
          theme: "vs-dark",
          fontSize: 14,
          fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          automaticLayout: true,
          minimap: { enabled: true },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          bracketPairColorization: { enabled: true }
        });

        // Shortcut: Ctrl+Enter to Run
        this.editor.addAction({
          id: "run-python-code",
          label: "Run Python Code",
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
          run: () => this.runCurrentCode()
        });

        // Shortcut: Ctrl+S to Save locally
        this.editor.addAction({
          id: "save-python-code",
          label: "Save Code",
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
          run: () => {
            this.saveStorage();
            this.renderTabs();
          }
        });

        this.switchExperiment(this.state.activeId);
      } catch (e) {
        console.error("Monaco load error:", e);
        mount.innerHTML = `<div class="exp-ide-error">Unable to load code editor. Please check internet connectivity and reload.</div>`;
      }
    }

    getOrCreateModel(expId) {
      if (!this.monaco) return null;
      if (this.models.has(expId)) return this.models.get(expId);

      const exp = this.getExperiment(expId);
      if (!exp) return null;

      const code = this.state.userCode[expId] !== undefined ? this.state.userCode[expId] : exp.starterCode;
      const uri = this.monaco.Uri.parse(`inmemory://leetcode/${expId.replace(/[^a-zA-Z0-9_]/g, '_')}.py`);
      let model = this.monaco.editor.getModel(uri);
      if (!model) {
        model = this.monaco.editor.createModel(code, "python", uri);
      }

      model.onDidChangeContent(() => {
        this.state.userCode[expId] = model.getValue();
        this.renderTabs();
        this.saveStorage();
      });

      this.models.set(expId, model);
      return model;
    }

    switchExperiment(expId) {
      const prevId = this.state.activeId;
      if (this.editor && prevId && this.models.has(prevId)) {
        this.viewStates.set(prevId, this.editor.saveViewState());
      }

      this.state.activeId = expId;
      if (!this.state.openTabs.includes(expId)) {
        this.state.openTabs.push(expId);
      }
      this.saveStorage();

      const model = this.getOrCreateModel(expId);
      if (this.editor && model) {
        this.editor.setModel(model);
        if (this.viewStates.has(expId)) {
          this.editor.restoreViewState(this.viewStates.get(expId));
        }
        this.editor.focus();
      }

      this.renderTabs();
      this.renderProblem();
      this.renderDock();

      // Update URL hash without full reload
      const exp = this.getExperiment(expId);
      if (exp) {
        history.replaceState(null, "", `#/exp/${exp.number}/${exp.part}`);
      }
    }

    closeTab(expId, e) {
      if (e) e.stopPropagation();
      const idx = this.state.openTabs.indexOf(expId);
      if (idx === -1) return;

      this.state.openTabs.splice(idx, 1);
      if (this.models.has(expId)) {
        this.models.get(expId).dispose();
        this.models.delete(expId);
      }
      this.viewStates.delete(expId);

      if (this.state.openTabs.length === 0) {
        const all = this.getAllExperiments();
        const nextId = all[0] ? all[0].id : "exp-1a";
        this.state.openTabs = [nextId];
        this.switchExperiment(nextId);
      } else if (this.state.activeId === expId) {
        const nextIdx = Math.max(0, idx - 1);
        this.switchExperiment(this.state.openTabs[nextIdx]);
      } else {
        this.renderTabs();
      }
    }

    isModified(expId) {
      const exp = this.getExperiment(expId);
      if (!exp) return false;
      const current = this.models.has(expId) ? this.models.get(expId).getValue() : (this.state.userCode[expId] || exp.starterCode);
      return current.trim() !== exp.starterCode.trim();
    }

    resetCurrentCode() {
      const expId = this.state.activeId;
      const exp = this.getExperiment(expId);
      if (!exp) return;

      if (this.isModified(expId)) {
        if (!confirm("Reset code?\nYour current changes will be lost.")) {
          return;
        }
      }

      if (this.models.has(expId)) {
        this.models.get(expId).setValue(exp.starterCode);
      }
      this.state.userCode[expId] = exp.starterCode;
      this.saveStorage();
      this.renderTabs();
    }

    renderTabs() {
      const bar = document.getElementById("exp-ide-tabs-bar");
      if (!bar) return;

      bar.innerHTML = this.state.openTabs.map(id => {
        const exp = this.getExperiment(id);
        if (!exp) return "";
        const isActive = id === this.state.activeId;
        const modified = this.isModified(id);

        return `
          <div class="exp-ide-tab ${isActive ? 'active' : ''}" onclick="window.expIDE.switchExperiment('${id}')">
            <span class="tab-title" title="${escapeHtml(exp.title)}">${escapeHtml(exp.title)}</span>
            ${modified ? '<span class="tab-dot" title="Modified">●</span>' : ''}
            <button class="tab-close" onclick="window.expIDE.closeTab('${id}', event)" title="Close tab">✕</button>
          </div>
        `;
      }).join("");
    }

    renderSidebar() {
      const catsEl = document.getElementById("exp-ide-category-chips");
      if (catsEl) {
        const all = this.getAllExperiments();
        const categories = ["All", ...new Set(all.map(e => e.category))];
        catsEl.innerHTML = categories.map(cat => `
          <button class="exp-cat-chip ${this.state.selectedCategory === cat ? 'active' : ''}" onclick="window.expIDE.setCategory('${cat}')">
            ${cat}
          </button>
        `).join("");
      }
      this.renderSidebarList();
    }

    setCategory(cat) {
      this.state.selectedCategory = cat;
      document.querySelectorAll(".exp-cat-chip").forEach(c => {
        c.classList.toggle("active", c.textContent.trim() === cat);
      });
      this.renderSidebarList();
    }

    renderSidebarList() {
      const listEl = document.getElementById("exp-ide-exp-list");
      if (!listEl) return;

      const all = this.getAllExperiments();
      const q = this.state.searchQuery;
      const cat = this.state.selectedCategory;

      const filtered = all.filter(e => {
        const matchesQ = !q || e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || (e.tags && e.tags.some(t => t.includes(q)));
        const matchesCat = cat === "All" || e.category === cat;
        return matchesQ && matchesCat;
      });

      listEl.innerHTML = filtered.map(e => {
        const isActive = e.id === this.state.activeId;
        const testRes = this.state.testResults[e.id];

        let badge = "";
        if (testRes) {
          badge = testRes.passed ? '<span class="status-pass">✓</span>' : '<span class="status-fail">✗</span>';
        }

        return `
          <div class="exp-nav-item ${isActive ? 'active' : ''}" onclick="window.expIDE.switchExperiment('${e.id}'); window.expIDE.closeSidebar();">
            <div class="exp-nav-title">
              <strong>${escapeHtml(e.title)}</strong>
              <div class="exp-nav-meta">
                <span class="cat-badge">${e.category}</span>
                <span class="diff-badge ${e.difficulty.toLowerCase()}">${e.difficulty}</span>
              </div>
            </div>
            ${badge}
          </div>
        `;
      }).join("");
    }

    closeSidebar() {
      this.state.sidebarOpen = false;
      const sidebar = document.getElementById("exp-ide-sidebar");
      if (sidebar) sidebar.classList.remove("open");
    }

    renderProblem() {
      const panel = document.getElementById("exp-ide-problem-content");
      const exp = this.getExperiment(this.state.activeId);
      if (!panel || !exp) return;

      let examplesHtml = "";
      if (exp.examples && exp.examples.length > 0) {
        examplesHtml = `
          <h4>Examples</h4>
          ${exp.examples.map((ex, i) => `
            <div class="exp-example-box">
              <strong>Example ${i + 1}:</strong>
              <div><b>Input:</b> <code>${escapeHtml(ex.input || "<none>")}</code></div>
              <div><b>Output:</b> <code>${escapeHtml(ex.output || "")}</code></div>
            </div>
          `).join("")}
        `;
      }

      let hintsHtml = "";
      if (exp.hints && exp.hints.length > 0) {
        hintsHtml = `
          <details class="exp-hints-box">
            <summary>💡 Hints (${exp.hints.length})</summary>
            <ul>${exp.hints.map(h => `<li>${h}</li>`).join("")}</ul>
          </details>
        `;
      }

      panel.innerHTML = `
        <div class="problem-header">
          <h2>${escapeHtml(exp.title)}</h2>
          <div class="problem-tags">
            <span class="cat-badge">${escapeHtml(exp.category)}</span>
            <span class="diff-badge ${exp.difficulty.toLowerCase()}">${escapeHtml(exp.difficulty)}</span>
          </div>
        </div>

        <div class="problem-description">
          <p>${exp.description}</p>
        </div>

        ${examplesHtml}

        ${exp.constraints ? `
          <h4>Constraints</h4>
          <p class="constraints-text">${escapeHtml(exp.constraints)}</p>
        ` : ''}

        ${exp.learningObjectives && exp.learningObjectives.length > 0 ? `
          <h4>Learning Objectives</h4>
          <ul>${exp.learningObjectives.map(o => `<li>${escapeHtml(o)}</li>`).join("")}</ul>
        ` : ''}

        ${hintsHtml}

        <h4>Expected Output Reference</h4>
        <pre class="exp-ref-output">${escapeHtml(exp.expectedOutput ? exp.expectedOutput.replace(/<img[^>]*>/g, '[Plot Generated]') : "")}</pre>
      `;
    }

    renderDock() {
      const exp = this.getExperiment(this.state.activeId);
      if (!exp) return;

      // 1. Input Tab
      const stdinEl = document.getElementById("exp-ide-stdin-text");
      if (stdinEl) {
        stdinEl.value = this.state.userInput[exp.id] !== undefined ? this.state.userInput[exp.id] : (exp.defaultInput || "");
      }

      // 2. Console Tab
      if (this.state.outputs[exp.id]) {
        this.renderConsoleOutput(this.state.outputs[exp.id]);
      } else {
        const consoleEl = document.getElementById("exp-ide-console-body");
        const plotEl = document.getElementById("exp-ide-plot-body");
        const metaEl = document.getElementById("exp-ide-dock-meta");
        if (consoleEl) consoleEl.innerHTML = `<div class="exp-ide-placeholder">Click <b>▶ Run</b> to execute your code in Python 3. Output will appear here.</div>`;
        if (plotEl) plotEl.innerHTML = "";
        if (metaEl) metaEl.innerHTML = "";
      }

      // 3. Tests Tab
      if (this.state.testResults[exp.id]) {
        this.renderTestResults(this.state.testResults[exp.id]);
      } else {
        const testsEl = document.getElementById("exp-ide-tests-body");
        if (testsEl) {
          if (!exp.testCases || exp.testCases.length === 0) {
            testsEl.innerHTML = `<div class="exp-ide-placeholder">No test cases configured for this problem. Run normally to view outputs.</div>`;
          } else {
            testsEl.innerHTML = `
              <div class="tests-intro">
                <p>Available Test Cases: <b>${exp.testCases.length}</b></p>
                <button class="exp-ide-btn exp-ide-btn-test" onclick="window.expIDE.runUnitTests()">Run Tests</button>
              </div>
            `;
          }
        }
      }
    }

    async runCurrentCode() {
      const expId = this.state.activeId;
      const exp = this.getExperiment(expId);
      if (!exp) return;

      let code = "";
      if (this.models.has(expId)) {
        code = this.models.get(expId).getValue();
      } else {
        code = this.state.userCode[expId] || exp.starterCode;
      }

      const stdinEl = document.getElementById("exp-ide-stdin-text");
      const stdinVal = stdinEl ? stdinEl.value : (this.state.userInput[expId] || exp.defaultInput || "");
      this.state.userInput[expId] = stdinVal;

      this.switchDock("console");
      const consoleEl = document.getElementById("exp-ide-console-body");
      const metaEl = document.getElementById("exp-ide-dock-meta");
      if (consoleEl) {
        consoleEl.innerHTML = `<div class="term-line info">Executing Python code...</div>`;
      }
      if (metaEl) {
        metaEl.innerHTML = `<span class="status-running">Running...</span>`;
      }

      try {
        const res = await window.pyodideRunner.run(code, stdinVal);
        this.state.outputs[expId] = res;
        this.saveStorage();
        this.renderConsoleOutput(res);
      } catch (err) {
        const errObj = {
          stdout: "",
          stderr: err.message,
          hasError: true,
          traceback: err.stack || err.message,
          executionTimeSec: 0,
          plots: []
        };
        this.state.outputs[expId] = errObj;
        this.renderConsoleOutput(errObj);
      }
    }

    async runUnitTests() {
      const expId = this.state.activeId;
      const exp = this.getExperiment(expId);
      if (!exp) return;

      const cases = exp.testCases || [];
      if (cases.length === 0) {
        this.switchDock("tests");
        const testsEl = document.getElementById("exp-ide-tests-body");
        if (testsEl) {
          testsEl.innerHTML = `<div class="exp-ide-placeholder">No test cases defined for this experiment.</div>`;
        }
        return;
      }

      let code = "";
      if (this.models.has(expId)) {
        code = this.models.get(expId).getValue();
      } else {
        code = this.state.userCode[expId] || exp.starterCode;
      }

      this.switchDock("tests");
      const testsEl = document.getElementById("exp-ide-tests-body");
      if (testsEl) {
        testsEl.innerHTML = `<div class="term-line info">Running ${cases.length} test cases...</div>`;
      }

      const results = [];
      let allPassed = true;

      for (let i = 0; i < cases.length; i++) {
        const tc = cases[i];
        try {
          const res = await window.pyodideRunner.run(code, tc.input);
          const actualTrim = (res.stdout || "").trim();
          const expectedTrim = (tc.expectedOutput || "").trim();
          const passed = !res.hasError && actualTrim === expectedTrim;
          if (!passed) allPassed = false;

          results.push({
            caseNumber: i + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: res.stdout,
            error: res.hasError ? (res.traceback || res.stderr) : null,
            passed: passed,
            duration: res.executionTimeSec
          });
        } catch (e) {
          allPassed = false;
          results.push({
            caseNumber: i + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: "",
            error: e.message,
            passed: false,
            duration: 0
          });
        }
      }

      const outcome = { passed: allPassed, results: results, timestamp: Date.now() };
      this.state.testResults[expId] = outcome;
      this.saveStorage();
      this.renderTestResults(outcome);
      this.renderSidebarList();
    }

    renderConsoleOutput(res) {
      const consoleEl = document.getElementById("exp-ide-console-body");
      const plotEl = document.getElementById("exp-ide-plot-body");
      const metaEl = document.getElementById("exp-ide-dock-meta");

      if (metaEl) {
        if (res.hasError) {
          metaEl.innerHTML = `<span class="status-error">✗ ERROR</span> <span class="time-tag">⏱ ${res.executionTimeSec}s</span>`;
        } else {
          metaEl.innerHTML = `<span class="status-success">✓ Execution completed</span> <span class="time-tag">⏱ ${res.executionTimeSec}s</span>`;
        }
      }

      if (consoleEl) {
        let parts = [];
        if (res.stdout) {
          parts.push(`<div class="out-section"><div class="out-tag stdout">STDOUT</div><pre class="out-code stdout-text">${escapeHtml(res.stdout)}</pre></div>`);
        }
        if (res.stderr) {
          parts.push(`<div class="out-section"><div class="out-tag stderr">STDERR</div><pre class="out-code stderr-text">${escapeHtml(res.stderr)}</pre></div>`);
        }
        if (res.traceback) {
          parts.push(`<div class="out-section"><div class="out-tag error">ERROR / TRACEBACK</div><pre class="out-code traceback-text">${escapeHtml(res.traceback)}</pre></div>`);
        }
        if (!res.stdout && !res.stderr && !res.traceback) {
          parts.push(`<div class="out-line success">✓ Program executed successfully with no stdout output.</div>`);
        }
        consoleEl.innerHTML = parts.join("");
      }

      if (plotEl) {
        if (res.plots && res.plots.length > 0) {
          plotEl.innerHTML = `
            <div class="exp-plot-box">
              <h4>Rendered Matplotlib Figures (${res.plots.length})</h4>
              ${res.plots.map((b64, idx) => `
                <div class="plot-item">
                  <div class="plot-bar">
                    <span>Figure ${idx + 1}</span>
                    <a href="data:image/png;base64,${b64}" download="plot_${idx + 1}.png" class="plot-dl-btn">⬇ Download PNG</a>
                  </div>
                  <img src="data:image/png;base64,${b64}" alt="Generated Figure ${idx + 1}">
                </div>
              `).join("")}
            </div>
          `;
        } else {
          plotEl.innerHTML = "";
        }
      }
    }

    renderTestResults(outcome) {
      const testsEl = document.getElementById("exp-ide-tests-body");
      const metaEl = document.getElementById("exp-ide-dock-meta");
      if (!testsEl) return;

      if (metaEl) {
        metaEl.innerHTML = outcome.passed
          ? `<span class="status-success">✓ All Tests Passed (${outcome.results.length}/${outcome.results.length})</span>`
          : `<span class="status-error">✗ Some Tests Failed</span>`;
      }

      testsEl.innerHTML = `
        <div class="tests-summary-bar ${outcome.passed ? 'pass' : 'fail'}">
          <strong>${outcome.passed ? '✓ All Test Cases Passed' : '✗ Some Test Cases Failed'}</strong>
          <button class="exp-ide-btn" onclick="window.expIDE.runUnitTests()">Re-run Tests</button>
        </div>
        <div class="tests-list">
          ${outcome.results.map(r => `
            <div class="test-item ${r.passed ? 'pass' : 'fail'}">
              <div class="test-item-top">
                <span class="test-badge ${r.passed ? 'pass' : 'fail'}">${r.passed ? '✓ Passed' : '✗ Failed'}</span>
                <strong>Case ${r.caseNumber}</strong>
                <span class="test-time">${r.duration}s</span>
              </div>
              <div class="test-details">
                <div><span class="lbl">Input:</span><pre>${escapeHtml(r.input || '<no input>')}</pre></div>
                <div><span class="lbl">Expected:</span><pre>${escapeHtml(r.expected)}</pre></div>
                <div><span class="lbl">Actual:</span><pre class="${r.passed ? '' : 'mismatch'}">${escapeHtml(r.actual)}</pre></div>
                ${r.error ? `<div><span class="lbl err">Error:</span><pre class="err">${escapeHtml(r.error)}</pre></div>` : ''}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  function escapeHtml(s) {
    if (typeof s !== "string") return "";
    return s.replace(/[&<>'"]/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[c]));
  }

  // Global singleton
  window.expIDE = new ExperimentIDE();
})();
