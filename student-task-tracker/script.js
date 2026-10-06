const taskInput = document.querySelector("#task");
const timeInput = document.querySelector("#time");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#taskList");
const tasks = [];

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.textContent = task.name + " (" + task.estimatedTime + " min)";
        taskList.appendChild(taskCard);
    });
}


taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const task = {
        name: taskInput.value,
        estimatedTime: Number(timeInput.value),
        completed: false
    };

    tasks.push(task);

    taskInput.value = "";
    timeInput.value = "";
    taskInput.focus();

    renderTasks();
});