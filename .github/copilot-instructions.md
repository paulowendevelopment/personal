# Copilot instructions for RepoMacMini

Purpose
- Provide actionable repository-specific guidance for future Copilot sessions.

Build, test, and lint commands
- This is a static single-page app (HTML/CSS/JS). No build, test, or lint tools are configured.
- To run locally: serve the directory and open in a browser:
  - python3 -m http.server 8000 && open http://localhost:8000
- No automated tests exist. For quick manual verification, open DevTools Console and interact with the UI.

High-level architecture
- Single-page static app:
  - index.html — DOM and markup. Key element IDs: #todo-form, #todo-input, #todo-list, #message
  - app.js — application logic (state, persistence, rendering, handlers)
  - styles.css — presentation
- Data/persistence: localStorage key "personal-todo-items" stores an array of todo objects.
- Main flow:
  - On load: todos are read from localStorage, then renderTodos() draws the list.
  - User adds a task -> form submit handler normalizes, prevents duplicates, unshifts into todos, saves and re-renders.
  - Buttons call toggle/delete handlers which update the todos array, save, and re-render.

Key conventions and code patterns
- Persistence key: STORAGE_KEY = "personal-todo-items" — search for STORAGE_KEY to locate persistence logic.
- Todo shape: { text: string, done: boolean }
- New items are added to the front of the list (todos.unshift) — newest-first ordering.
- Duplicate detection is case-insensitive (text.toLowerCase()). Keep that behavior if changing equality checks.
- renderTodos() clears and re-creates DOM nodes every render. Event handlers rely on the index from forEach; after any mutate+render the indices are stable.
- showMessage(text) displays a message for ~3s via a CSS class; the container is #message.

Files checked for AI configs and contributing docs
- README.md exists but is minimal.
- No CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, CONVENTIONS.md, or other AI assistant rule files were found in the project root.

Editing guidance for Copilot sessions
- When modifying DOM IDs, update both index.html and the selectors in app.js.
- When changing persistence format, add a migration helper that reads old localStorage keys and transforms data before overwrite.
- Prefer calling saveTodos() then renderTodos() after mutations; tests or helpers that bypass this will produce inconsistent UI state.

If you add tests / tooling
- Add a package.json and CI if you want automated lint/tests. For E2E tests, Playwright (or similar) is a natural fit for this static site; see prompt below about adding an MCP server.

Quick references
- Key functions to search for: renderTodos, saveTodos, showMessage
- Persistence key: "personal-todo-items"

