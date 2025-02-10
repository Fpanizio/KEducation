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

    filteredTasks = filteredTasks.reverse();

    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    paginatedTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
                <div class="task-content">
                    <div class="task-status ${
                      task.completed ? "completed" : "pending"
                    }">
                        ${
                          task.completed
                            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                            : ""
                        }
                    </div>
                    <span>${task.text}</span>
                </div>
                <div class="task-buttons">
                    <button class="complete-btn" data-index="${tasks.indexOf(
                      task
                    )}">Concluir</button>
                    <button class="delete-btn" data-index="${tasks.indexOf(
                      task
                    )}">Excluir</button>
                </div>
            `;
      taskList.appendChild(li);

      li.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;

        document.querySelectorAll(".task-buttons.show").forEach((buttons) => {
          if (buttons !== li.querySelector(".task-buttons")) {
            buttons.classList.remove("show");
          }
        });

        const buttons = li.querySelector(".task-buttons");
        buttons.classList.toggle("show");
      });

      const completeBtn = li.querySelector(".complete-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      completeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = e.target.getAttribute("data-index");
        toggleTaskCompletion(index);
      });

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = e.target.getAttribute("data-index");
        deleteTask(index);
      });
    });

    pageInfo.textContent = `${currentPage}`;

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

  function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  // Filtros
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

  // Paginação
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
