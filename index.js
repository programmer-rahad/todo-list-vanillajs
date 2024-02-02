// Selector Function
const $ = (selector, areAll) => {
  const all = document.querySelectorAll(selector);
  const single = document.querySelector(selector);
  return areAll ? all : single;
};

// Define UI Variables
const confirmation = $("#confirmation");
const confirmYesBtn = $("button.yes");
const confirmNoBtn = $("button.no");
const form = $("form");
const taskListWrap = $(".todo-list");
const taskList = $("ul");
const clearBtn = $(".clear-task");
const taskInput = $(".todo-input input");
const filterInput = $(".todo-list input");
let clearTimeoutId;
let todos = localStorage.getItem("tasks");
todos = todos ? JSON.parse(todos) : [];

// Function: Load Event Listeners
function loadEventListeners() {
  // Doucment Loaded
  document.addEventListener("DOMContentLoaded", renderTasks);
  // Submit The Form
  form.addEventListener("submit", submitForm);
  // Remove Task
  taskList.addEventListener("click", removeTask);
  // Clear Tasks
  clearBtn.addEventListener("click", clearTasks);
  // Filter Tasks
  filterInput.addEventListener("keyup", filterTasks);
}
// Load all event listeners
loadEventListeners();

// Function: Render Tasks
function renderTasks() {
  todos.forEach((todo) => {
    createAndAppendTask(todo);
  });
  showHideTasks();
}

// Function: Add Task
function submitForm(e) {
  const inputVal = taskInput.value.trim();
  if (!inputVal) {
    clearTimeout(clearTimeoutId);
    taskInput.classList.add("input-warn");
    taskInput.placeholder = "Input can't be empty";
    clearTimeoutId = setTimeout(() => {
      taskInput.classList.remove("input-warn");
      taskInput.placeholder = "New Task";
    }, 2500);
  } else {
    createAndAppendTask(inputVal);
    appendTaskToLocalStorage(inputVal);
    showHideTasks();
    taskInput.value = "";
  }
  e.preventDefault();
}
// Function: Create And Append Task
const createAndAppendTask = (value) => {
  const li = document.createElement("li");
  li.innerHTML = `
        <span>${value}</span>
        <i>&times;</i>
    `;
  taskList.append(li);
};

// Function: Append Task to Local Storage
function appendTaskToLocalStorage(val) {
  todos.push(val);
  localStorage.setItem("tasks", JSON.stringify(todos));
}
// Function: Remove Single Task
function removeTask(e) {
  if (e.target.nodeName === "I") {
    const targetParent = e.target.parentElement;
    confirmation.classList.remove("d-none");

    const deleteOrCancel = (e) => {
      const yes = e.target.classList.contains("yes");
      const no = e.target.classList.contains("no");
      if (yes) {
        targetParent.remove();
        removeTaskFromLocalStorage(targetParent);
        confirmation.classList.add("d-none");
        confirmation.removeEventListener("click", deleteOrCancel);
        showHideTasks();
      }
      if (no) {
        confirmation.classList.add("d-none");
        confirmation.removeEventListener("click", deleteOrCancel);
      }
    };
    confirmation.addEventListener("click", deleteOrCancel);
  }
}

// Function: Remove Task From Local Storage
function removeTaskFromLocalStorage(li) {
  const text = li.firstElementChild.textContent;
  // todos.forEach( todo => {
  //   todo = String(todo);
  //   console.log(text === todo);
  // })
  todos = todos.filter((todo)=> todo !== text );
  localStorage.setItem('tasks',JSON.stringify(todos))
}
// Function: Clear All Tasks
function clearTasks(e) {
  confirmation.classList.remove("d-none");
  const clearOrCancel = (e) => {
    const yes = e.target.classList.contains("yes");
    const no = e.target.classList.contains("no");
    if (yes) {
      while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
      }
      clearTasksFromLocalStorage();
      showHideTasks();
      confirmation.classList.add("d-none");
      confirmation.removeEventListener("click", clearOrCancel);
    }
    if (no) {
      confirmation.classList.add("d-none");
      confirmation.removeEventListener("click", clearOrCancel);
    }
  };
  confirmation.addEventListener("click", clearOrCancel);
  e.preventDefault();
}
// Function: Clear Tasks From Local Storage
function clearTasksFromLocalStorage() {
  localStorage.clear()
}
// Function: Show Hide Tasks
function showHideTasks() {
  !taskList.children.length && taskListWrap.classList.add("d-none");
  taskList.children.length && taskListWrap.classList.remove("d-none");
}
// Function: Filter Tasks
function filterTasks() {
  const listItems = [...taskList.children];
  const filterVal = this.value.trim().toLowerCase();
  // console.log(filterVal);
  listItems.forEach((li) => {
    const val = li.firstElementChild.textContent.toLowerCase();
    if (!val.includes(filterVal)) li.classList.add("d-none");
    else li.classList.remove("d-none");
  });
}
