const STORAGE_KEY = "personal-todo-items";
const THEME_KEY = "personal-task-theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const message = document.getElementById("message");
const clearButton = document.getElementById("clear-button");
const themeToggleButton = document.getElementById("theme-toggle-button");
const bodyElement = document.body;

let todos = loadTodos();

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to load tasks:", error);
    return [];
  }
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  if (!bodyElement) return;

  const isDark = theme === "dark";
  bodyElement.classList.toggle("dark", isDark);

  if (themeToggleButton) {
    themeToggleButton.textContent = isDark ? "Light mode" : "Dark mode";
  }

  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const nextTheme = bodyElement.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
  showMessage(
    `${nextTheme === "dark" ? "Dark" : "Light"} mode enabled.`,
    "info",
  );
}

function initTheme() {
  applyTheme(loadTheme());
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  updateClearButton();
}

function updateClearButton() {
  if (!clearButton) return;
  clearButton.disabled = todos.length === 0;
}

function createTodo(text) {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    done: false,
  };
}

function showMessage(text, type = "info") {
  if (!message) return;

  message.textContent = text;
  message.className = `message show ${type}`;

  clearTimeout(showMessage.timeoutId);
  showMessage.timeoutId = setTimeout(() => {
    if (message) {
      message.className = "message";
    }
  }, 3000);
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent =
      "Your task list is empty. Add a task to get started.";
    emptyMessage.className = "todo-item empty-state";
    list.appendChild(emptyMessage);
    updateClearButton();
    updateSummary();
    return;
  }

  const fragment = document.createDocumentFragment();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.done ? " completed" : ""}`;
    item.dataset.id = todo.id;

    const label = document.createElement("span");
    label.textContent = todo.text;
    label.className = "label";

    const controls = document.createElement("div");
    controls.className = "controls";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = todo.done ? "Undo" : "Done";
    toggleButton.addEventListener("click", () => toggleTask(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeTask(todo.id));

    controls.appendChild(toggleButton);
    controls.appendChild(deleteButton);

    item.appendChild(label);
    item.appendChild(controls);
    fragment.appendChild(item);
  });

  list.appendChild(fragment);
  updateClearButton();
  updateSummary();
}

function updateSummary() {
  const summaryText = document.getElementById("summary-text");
  if (!summaryText) return;

  const total = todos.length;
  const completed = todos.filter((todo) => todo.done).length;
  const pending = total - completed;

  if (total === 0) {
    summaryText.textContent = "No tasks yet.";
    return;
  }

  summaryText.textContent = `${total} task${total === 1 ? "" : "s"} • ${completed} completed • ${pending} pending`;
}

function toggleTask(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo,
  );

  saveTodos();
  renderTodos();
}

function removeTask(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearAllTasks() {
  if (!todos.length) return;
  todos = [];
  saveTodos();
  renderTodos();
  showMessage("All tasks have been removed.", "warning");
}

function handleFormSubmit(event) {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    showMessage("Enter a task before adding.", "warning");
    return;
  }

  const normalizedText = text.toLowerCase();
  if (todos.some((todo) => todo.text.toLowerCase() === normalizedText)) {
    showMessage("That task already exists.", "warning");
    return;
  }

  todos.unshift(createTodo(text));
  input.value = "";
  saveTodos();
  renderTodos();
  showMessage("Task added successfully.");
  input.focus();
}

form.addEventListener("submit", handleFormSubmit);
clearButton.addEventListener("click", clearAllTasks);
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", toggleTheme);
}

initTheme();
renderTodos();
updateSummary();
