document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const showAll = document.getElementById("showAll");
  const showPending = document.getElementById("showPending");
  const showCompleted = document.getElementById("showCompleted");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentPage = 1;
  const tasksPerPage = 5;

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

    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    paginatedTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <button class="complete-btn" data-index="${tasks.indexOf(task)}">Concluir</button>
        <button class="delete-btn" data-index="${tasks.indexOf(task)}">Excluir</button>
      `;
      taskList.appendChild(li);

      const completeBtn = li.querySelector(".complete-btn");
      completeBtn.addEventListener("click", () => {
        tasks[tasks.indexOf(task)].completed = !tasks[tasks.indexOf(task)].completed;
        saveTasks();
        renderTasks(filter);
      });

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasks();
        renderTasks(filter);
      });
    });

    pageInfo.textContent = `Página ${currentPage}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= filteredTasks.length;
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

  showAll.addEventListener("click", () => {
    currentPage = 1;
    renderTasks("all");
  });
  showPending.addEventListener("click", () => {
    currentPage = 1;
    renderTasks("pending");
  });
  showCompleted.addEventListener("click", () => {
    currentPage = 1;
    renderTasks("completed");
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTasks();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const filteredTasks = tasks.filter((task) => {
      if (showPending.classList.contains("active")) return !task.completed;
      if (showCompleted.classList.contains("active")) return task.completed;
      return true;
    });
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTasks();
    }
  });

  renderTasks();
});