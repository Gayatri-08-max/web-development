const taskInput = document.querySelector("#task");
const timeInput = document.querySelector("#time");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#taskList");
const scoreDisplay = document.querySelector("#score");

const tasks = [];
let totalPoints = 0;

const taskEmojis = ["📚", "💻", "📝", "🧠", "🎯", "🔬", "🎨", "🚀"];

function getTimerText(task) {
    const minutes = String(Math.floor(task.secondsSpent / 60)).padStart(2, "0");
    const seconds = String(task.secondsSpent % 60).padStart(2, "0");
    let text = "⏱️ Time spent: " + minutes + ":" + seconds;
    if (task.timerId !== null) {
        text = text + " (running)";
    }
    return text;
}

function stopTimer(task) {
    if (task.timerId !== null) {
        clearInterval(task.timerId);
        task.timerId = null;
    }
}

function updateScore() {
    scoreDisplay.textContent = "🏆 Productivity Score: " + totalPoints + " points";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        const taskName = document.createElement("h3");
        taskName.textContent = task.emoji + " " + task.name;

        const taskTime = document.createElement("p");
        taskTime.textContent = "⏳ Estimated time: " + task.estimatedTime + " min";

        const taskTimer = document.createElement("p");
        taskTimer.id = "timer-" + task.id;
        taskTimer.textContent = getTimerText(task);

        const taskStatus = document.createElement("p");
        if (task.completed) {
            taskStatus.textContent = "Status: Completed ✅";
        } else {
            taskStatus.textContent = "Status: Pending";
        }

        taskCard.appendChild(taskName);
        taskCard.appendChild(taskTime);
        taskCard.appendChild(taskTimer);
        taskCard.appendChild(taskStatus);

        if (task.completed) {
            const taskResult = document.createElement("p");
            taskResult.textContent = task.remark;
            taskResult.classList.add("result");
            taskCard.appendChild(taskResult);
        }

        if (!task.completed) {
            const startButton = document.createElement("button");
            startButton.textContent = "▶️ Start";
            startButton.classList.add("start-btn");

            startButton.addEventListener("click", function () {
                if (task.timerId !== null) {
                    return;
                }

                task.timerId = setInterval(function () {
                    task.secondsSpent = task.secondsSpent + 1;

                    const timerElement = document.querySelector("#timer-" + task.id);
                    if (timerElement) {
                        timerElement.textContent = getTimerText(task);
                    }
                }, 1000);

                renderTasks();
            });

            taskCard.appendChild(startButton);

            const pauseButton = document.createElement("button");
            pauseButton.textContent = "⏸️ Pause";
            pauseButton.classList.add("pause-btn");

            pauseButton.addEventListener("click", function () {
                stopTimer(task);
                renderTasks();
            });

            taskCard.appendChild(pauseButton);

            const completeButton = document.createElement("button");
            completeButton.textContent = "✅ Completed";
            completeButton.classList.add("complete-btn");

            completeButton.addEventListener("click", function () {
                stopTimer(task);
                task.completed = true;

                const plannedSeconds = task.estimatedTime * 60;

                if (task.secondsSpent <= plannedSeconds) {
                    task.points = 10;
                    task.remark = "🎉 Completed on time! +10 points";
                } else {
                    task.points = 5;
                    task.remark = "⏰ Completed late. Consider increasing the estimated time next time. +5 points";
                }

                totalPoints = totalPoints + task.points;

                renderTasks();
            });

            taskCard.appendChild(completeButton);
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️ Delete";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function () {
            stopTimer(task);
            tasks.splice(index, 1);
            renderTasks();
        });

        taskCard.appendChild(deleteButton);

        taskList.appendChild(taskCard);
    });

    updateScore();
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const task = {
        id: Date.now(),
        name: taskInput.value,
        estimatedTime: Number(timeInput.value),
        completed: false,
        secondsSpent: 0,
        timerId: null,
        points: 0,
        remark: "",
        emoji: taskEmojis[tasks.length % taskEmojis.length]
    };

    tasks.push(task);

    taskInput.value = "";
    timeInput.value = "";
    taskInput.focus();

    renderTasks();
});