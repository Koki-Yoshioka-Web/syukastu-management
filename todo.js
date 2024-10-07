document.addEventListener("DOMContentLoaded", function () {
  // Load saved tasks from localStorage
  var tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  const taskList = document.getElementById("task-list");

  // Display tasks, sorted by deadline
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  tasks.forEach((task) => {
    addTaskToDOM(task);
  });

  // Add a task
  window.addTask = function () {
    const taskInput = document.getElementById("new-task");
    const deadlineInput = document.getElementById("task-deadline");

    const task = {
      title: taskInput.value,
      deadline: deadlineInput.value,
      completed: false, // Initialize task as not completed
    };

    if (task.title && task.deadline) {
      tasks.push(task);
      // Sort tasks by deadline before displaying
      tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
      taskList.innerHTML = ""; // Clear existing list
      tasks.forEach((task) => addTaskToDOM(task)); // Re-render sorted list

      taskInput.value = "";
      deadlineInput.value = "";
    }
  };

  // Add task to the DOM
  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed); // Add completed class if task is completed

    li.innerHTML = `
          <input type="checkbox" ${
            task.completed ? "checked" : ""
          } onclick="toggleTaskCompletion('${task.title}')">
          ${task.title} - ${task.deadline}
          <button class="delete-btn" onclick="deleteTask('${
            task.title
          }')">Delete</button>
        `;

    taskList.appendChild(li);
  }

  // Toggle task completion
  window.toggleTaskCompletion = function (taskTitle) {
    tasks = tasks.map((task) => {
      if (task.title === taskTitle) {
        task.completed = !task.completed; // Toggle completion status
      }
      return task;
    });

    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    taskList.innerHTML = "";
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sort after toggling
    tasks.forEach((task) => addTaskToDOM(task)); // Re-render sorted list
  };

  // Delete a task
  window.deleteTask = function (taskTitle) {
    tasks = tasks.filter((task) => task.title !== taskTitle);
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    taskList.innerHTML = "";
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sort after deleting
    tasks.forEach((task) => addTaskToDOM(task));
  };
});
