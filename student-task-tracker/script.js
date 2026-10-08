const taskInput = document.querySelector("#task");
const timeInput = document.querySelector("#time");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#taskList");
const scoreDisplay = document.querySelector("#score");

const tasks = [];
let totalPoints = 0;

const taskEmojis = ["📚", "💻", "📝", "🧠", "🎯", "🔬", "🎨", "🚀"];

let audioContext = null;

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

function playBeep(pitch, length, delay) {
    if (audioContext === null) {
        return;
    }

    const startTime = audioContext.currentTime + (delay || 0);

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    oscillator.frequency.value = pitch;
    volume.gain.value = 0.2;

    oscillator.start(startTime);
    oscillator.stop(startTime + length);
}

function getWarningText(task) {
    const remaining = task.estimatedTime * 60 - task.secondsSpent;

    if (task.timerId === null || remaining <= 0 || remaining > 30) {
        return "";
    }

    if (remaining <= 10) {
        return "🚨 Only " + remaining + " seconds left!";
    }

    return "⚠️ " + remaining + " seconds left";
}

function applyWarning(task, element) {
    const remaining = task.estimatedTime * 60 - task.secondsSpent;

    element.textContent = getWarningText(task);

    if (remaining <= 10) {
        element.classList.add("urgent");
    } else {
        element.classList.remove("urgent");
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

        if (task.timeUpShown && !task.completed) {
            const timeUpMessage = document.createElement("p");
            timeUpMessage.textContent = "⏰ Time's up! Your planned time is over.";
            timeUpMessage.classList.add("time-up");
            taskCard.appendChild(timeUpMessage);
        }

        if (task.completed) {
            const taskResult = document.createElement("p");
            taskResult.textContent = task.remark;
            taskResult.classList.add("result");
            taskCard.appendChild(taskResult);
        }

        if (!task.completed) {
            const warningMessage = document.createElement("p");
            warningMessage.id = "warning-" + task.id;
            warningMessage.classList.add("warning");
            applyWarning(task, warningMessage);
            taskCard.appendChild(warningMessage);

            const startButton = document.createElement("button");
            startButton.textContent = "▶️ Start";
            startButton.classList.add("start-btn");

            startButton.addEventListener("click", function () {
                if (task.timerId !== null) {
                    return;
                }

                if (audioContext === null) {
                    audioContext = new AudioContext();
                }
                audioContext.resume();

                task.timerId = setInterval(function () {
                    task.secondsSpent = task.secondsSpent + 1;

                    const timerElement = document.querySelector("#timer-" + task.id);
                    if (timerElement) {
                        timerElement.textContent = getTimerText(task);
                    }

                    const warningElement = document.querySelector("#warning-" + task.id);
                    if (warningElement) {
                        applyWarning(task, warningElement);
                    }

                    const remaining = task.estimatedTime * 60 - task.secondsSpent;

                    if (remaining === 30 && !task.warn30Played) {
                        task.warn30Played = true;
                        playBeep(660, 0.4, 0);
                    }

                    if (remaining === 20 && !task.warn20Played) {
                        task.warn20Played = true;
                        playBeep(770, 0.4, 0);
                        playBeep(770, 0.4, 0.6);
                    }

                    if (remaining === 10 && !task.warn10Played) {
                        task.warn10Played = true;
                        playBeep(880, 0.4, 0);
                        playBeep(880, 0.4, 0.6);
                        playBeep(880, 0.4, 1.2);
                    }

                    if (!task.timeUpShown && task.secondsSpent >= task.estimatedTime * 60) {
                        task.timeUpShown = true;
                        playBeep(1000, 1.5, 0);
                        renderTasks();
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
        timeUpShown: false,
        warn30Played: false,
        warn20Played: false,
        warn10Played: false,
        emoji: taskEmojis[tasks.length % taskEmojis.length]
    };

    tasks.push(task);

    taskInput.value = "";
    timeInput.value = "";
    taskInput.focus();

    renderTasks();
});