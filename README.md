# DATASCIENCE – Digital Library

A static, offline-friendly website (no build step, no server needed).

## How to run
Open `index.html` in any modern browser. It is fully self-contained (CSS, JS and photo are embedded), so it works even on its own.

`index_modular.html` is the same site split into `css/` and `js/` files, which is easier to edit. It needs those folders beside it.

## Structure
- `index.html` – complete standalone website (the original design)
- `index_modular.html` – same page loading `css/` and `js/` separately
- `css/style.css` – all styling (dark/light theme aware)
- `js/config.js` – your details (name, roll no, links, photo). Edit here.
- `js/modules.js` – Module summaries (`MODS`) and full notes (`FULL`)
- `js/resume_data.js` – the resume PDF embedded so it opens even from the standalone page
- `resume/Pranathi_Resume.pdf` – your resume (also linked from About Me)
- `js/tools.js` – Tools for Data Science content
- `js/experiments.js` – Lab experiments: code + expected output (`EXPS`)
- `js/app.js` – routing and page rendering
- `assets/photo.jpg` – profile photo
- `assets/logo.svg` – library logo (also inlined in the header and used as the favicon)

## Extra copies of the content (for reading / running in Jupyter or Colab)
- `experiments/` – every experiment program as a `.py` file with its `_output.txt`
- `module_notes/` – each module's full notes as HTML, plus summaries and tools as Markdown
