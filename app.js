const STORAGE_KEY = "personal-todo-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const message = document.getElementById("message");

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function showMessage(text) {
  if (!message) return;
  message.textContent = text;
  message.classList.add("show");
  setTimeout(() => {
    message.classList.remove("show");
  }, 3000);
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No tasks yet. Add one above!";
    emptyMessage.className = "todo-item";
    emptyMessage.style.justifyContent = "center";
    list.appendChild(emptyMessage);
    return;
  }

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.done ? " completed" : ""}`;

    const label = document.createElement("span");
    label.textContent = todo.text;
    label.className = "label";

    const controls = document.createElement("div");
    controls.className = "controls";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = todo.done ? "Undo" : "Done";
    toggleButton.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    controls.appendChild(toggleButton);
    controls.appendChild(deleteButton);

    item.appendChild(label);
    item.appendChild(controls);
    list.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const normalizedText = text.toLowerCase();
  if (todos.some((todo) => todo.text.toLowerCase() === normalizedText)) {
    showMessage("That task already exists.");
    return;
  }

  todos.unshift({ text, done: false });
  input.value = "";
  saveTodos();
  renderTodos();
});

renderTodos();
