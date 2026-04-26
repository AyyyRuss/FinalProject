const taskForm = document.getElementById("taskForm");
const taskNameInput = document.getElementById("taskName");
const taskPriorityInput = document.getElementById("taskPriority");
const taskImportantInput = document.getElementById("taskImportant");
const taskCompletedInput = document.getElementById("taskCompleted");
const submitButton = document.getElementById("submitButton");
const taskManager = document.getElementById("taskmanager");
const totalCount = document.getElementById("totalCount");
const completeCount = document.getElementById("completeCount");
const importantCount = document.getElementById("importantCount");
const themeToggle = document.querySelector("[data-theme-toggle]");

let tasks = [];
let nextId = 1;
let editTaskId = null;
let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);

  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} mode`
  );

  themeToggle.innerHTML = theme === "dark"
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
      </svg>`;
}

function logTasks() {
  console.log(JSON.stringify(tasks));
}

function getPriorityClass(priority) {
  if (priority === "High") {
    return "priority-high";
  }

  if (priority === "Medium") {
    return "priority-medium";
  }

  return "priority-low";
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function updateSummary() {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const importantTasks = tasks.filter(task => task.isImportant).length;

  totalCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  completeCount.textContent = `${completedTasks} done`;
  importantCount.textContent = `${importantTasks} important`;
}

function renderTasks() {
  if (tasks.length === 0) {
    taskManager.innerHTML = `
      <div class="empty-state">
        <h3 class="panel-title">No tasks yet</h3>
        <p class="panel-copy">Add your first task to start tracking priority, importance, and completion.</p>
      </div>
    `;
    updateSummary();
    return;
  }

  taskManager.innerHTML = tasks.map(task => `
    <article class="task-card" data-id="${task.id}">
      <div class="task-top">
        <div>
          <h3 class="task-name">${task.name}</h3>
          <div class="task-meta">
            <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
            ${task.isImportant ? '<span class="badge">Important</span>' : ""}
            ${task.isCompleted ? '<span class="badge">Completed</span>' : ""}
          </div>
        </div>

        <span class="task-date">Added ${formatDate(task.date)}</span>
      </div>

      <div class="task-actions">
        <button class="btn btn-secondary" type="button" data-action="toggle" data-id="${task.id}">
          ${task.isCompleted ? "Mark active" : "Mark done"}
        </button>
        <button class="btn btn-secondary" type="button" data-action="edit" data-id="${task.id}">
          Edit
        </button>
        <button class="btn btn-secondary" type="button" data-action="delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    </article>
  `).join("");

  tasks.forEach(task => {
    const taskCard = taskManager.querySelector(`[data-id="${task.id}"]`);

    if (!taskCard) {
      return;
    }

    const taskName = taskCard.querySelector(".task-name");

    if (task.isImportant) {
      taskCard.style.borderColor = "rgba(161, 53, 68, 0.35)";
      taskCard.style.boxShadow = "inset 0 0 0 1px rgba(161, 53, 68, 0.20)";
      taskName.style.color = "red";
    }

    if (task.isCompleted) {
      taskName.style.textDecoration = "line-through";
      taskName.style.opacity = "0.7";
      taskCard.style.background = "color-mix(in srgb, var(--color-success) 10%, var(--color-surface-2) 90%)";
    }

    if (!task.isImportant && !task.isCompleted) {
      taskCard.style.boxShadow = "none";
    }
  });

  updateSummary();
}

function resetFormState() {
  taskForm.reset();
  editTaskId = null;
  submitButton.textContent = "Add task";
  taskPriorityInput.value = "Medium";
  taskNameInput.focus();
}

function createTask() {
  const taskName = taskNameInput.value.trim();

  if (!taskName) {
    alert("Please enter a task name.");
    taskNameInput.focus();
    return;
  }

  if (editTaskId !== null) {
    const taskToUpdate = tasks.find(task => task.id === editTaskId);

    if (!taskToUpdate) {
      return;
    }

    taskToUpdate.name = taskName;
    taskToUpdate.priority = taskPriorityInput.value;
    taskToUpdate.isImportant = taskImportantInput.checked;
    taskToUpdate.isCompleted = taskCompletedInput.checked;

    logTasks();
    renderTasks();
    resetFormState();
    return;
  }

  const task = {
    id: nextId++,
    name: taskName,
    priority: taskPriorityInput.value,
    isImportant: taskImportantInput.checked,
    isCompleted: taskCompletedInput.checked,
    date: new Date().toISOString()
  };

  tasks.push(task);
  logTasks();
  renderTasks();
  resetFormState();
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  logTasks();
  renderTasks();

  if (editTaskId === taskId) {
    resetFormState();
  }
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return;
  }

  task.isCompleted = !task.isCompleted;
  logTasks();
  renderTasks();
}

function editTask(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    return;
  }

  editTaskId = task.id;
  taskNameInput.value = task.name;
  taskPriorityInput.value = task.priority;
  taskImportantInput.checked = task.isImportant;
  taskCompletedInput.checked = task.isCompleted;
  submitButton.textContent = "Update task";
  taskNameInput.focus();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  createTask();
});

taskManager.addEventListener("click", event => {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) {
    return;
  }

  const taskId = Number(actionButton.dataset.id);
  const action = actionButton.dataset.action;

  if (action === "delete") {
    deleteTask(taskId);
  }

  if (action === "toggle") {
    toggleTaskCompletion(taskId);
  }

  if (action === "edit") {
    editTask(taskId);
  }
});

taskForm.addEventListener("reset", () => {
  window.setTimeout(() => {
    editTaskId = null;
    submitButton.textContent = "Add task";
    taskPriorityInput.value = "Medium";
  }, 0);
});

themeToggle.addEventListener("click", () => {
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

setTheme(currentTheme);
renderTasks();