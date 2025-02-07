document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  let tasks = [];

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = task.text;
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text });
      taskInput.value = "";
      renderTasks();
    }
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
});