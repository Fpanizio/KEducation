document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const showAll = document.getElementById("showAll");
  const showPending = document.getElementById("showPending");
  const showCompleted = document.getElementById("showCompleted");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter((task) => {
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <button class="complete-btn" data-index="${index}">Concluir</button>
        <button class="delete-btn" data-index="${index}">Excluir</button>
      `;
      taskList.appendChild(li);

      const completeBtn = li.querySelector(".complete-btn");
      completeBtn.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(filter);
      });

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filter);
      });
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      saveTasks();
      taskInput.value = "";
      renderTasks();
    }
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  showAll.addEventListener("click", () => renderTasks("all"));
  showPending.addEventListener("click", () => renderTasks("pending"));
  showCompleted.addEventListener("click", () => renderTasks("completed"));

  renderTasks();
});