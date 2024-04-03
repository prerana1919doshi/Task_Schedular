document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDate");
    const prioritySelect = document.getElementById("prioritySelect");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const todoList = document.getElementById("todoList");
    const completedList = document.getElementById("completedList");
  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {todo: [], completed: []};
    renderTasks();
  
    addTaskBtn.addEventListener("click", function() {
      const taskText = taskInput.value.trim();
      const dueDate = dueDateInput.value;
      const priority = prioritySelect.value;
      if (taskText !== "") {
        tasks.todo.push({text: taskText, dueDate: dueDate, priority: priority, done: false});
        saveTasks();
        renderTasks();
        taskInput.value = "";
        dueDateInput.value = "";
        prioritySelect.value = "low";
      } else {
        alert("Please enter a task!");
      }
    });
  
    function renderTasks() {
      todoList.innerHTML = "";
      completedList.innerHTML = "";
  
      tasks.todo.forEach((task, index) => {
        const li = createTaskElement(task, index, "todo");
        todoList.appendChild(li);
      });
  
      tasks.completed.forEach((task, index) => {
        const li = createTaskElement(task, index, "completed");
        completedList.appendChild(li);
      });
  
      const sortableTodo = new Sortable(todoList, {
        group: 'tasks',
        animation: 150,
        onEnd: function(evt) {
          const movedTask = tasks.todo.splice(evt.oldIndex, 1)[0];
          tasks.todo.splice(evt.newIndex, 0, movedTask);
          saveTasks();
        }
      });
  
      const sortableCompleted = new Sortable(completedList, {
        group: 'tasks',
        animation: 150,
        onEnd: function(evt) {
          const movedTask = tasks.completed.splice(evt.oldIndex, 1)[0];
          tasks.completed.splice(evt.newIndex, 0, movedTask);
          saveTasks();
        }
      });
    }
  
    function createTaskElement(task, index, type) {
      const li = document.createElement("li");
      li.className = "task-item list-group-item";
      li.textContent = task.text;
      if (type === "completed") {
        li.classList.add("completed-task");
      }
      if (task.dueDate) {
        const dueDateSpan = document.createElement("span");
        dueDateSpan.textContent = "Due Date: " + task.dueDate;
        li.appendChild(dueDateSpan);
      }
      if (task.priority) {
        const prioritySpan = document.createElement("span");
        prioritySpan.textContent = "Priority: " + task.priority;
        li.appendChild(prioritySpan);
      }
      if (type === "todo") {
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Task Done";
        doneBtn.className = "btn btn-success btn-sm ml-2";
        doneBtn.addEventListener("click", function(event) {
          event.stopPropagation();
          tasks.todo[index].done = true;
          tasks.completed.push(tasks.todo[index]);
          tasks.todo.splice(index, 1);
          saveTasks();
          renderTasks();
        });
        li.appendChild(doneBtn);
      }
      return li;
    }
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
  