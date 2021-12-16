let tasks = [];
const addTaskBtn = document.getElementById("addTaskBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
        const time = document.getElementById("time");
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
        let seconds = "00";
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, "0");
        }
        time.textContent = `${minutes}:${seconds}`;
    })
}

updateTime();
setInterval(updateTime, 1000);

resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startBtn.textContent = "Start Timer";
    })
})

startBtn.addEventListener("click", () => {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
        })
    })
})

addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(['tasks'], (res) => {
    tasks = res.tasks ? res.tasks : [];
    renderTasks();
})

function saveTask() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    const taskRow = document.createElement("div");

    const task = document.createElement("input");
    task.type = "text";
    task.placeholder = "Enter a task...";
    task.value = tasks[taskNum];
    task.className = "inputTask";
    task.addEventListener("change", () => {
        tasks[taskNum] = task.value;
        saveTask();
    })

    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X";
    deleteBtn.className = "inputDeleteBtn";
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum);
    })

    taskRow.appendChild(task);
    taskRow.appendChild(deleteBtn);

    const taskContainer = document.getElementById("taskContainer");
    taskContainer.appendChild(taskRow);
}

function addTask() {
    const taskNum = tasks.length;
    tasks.push("");
    renderTask(taskNum);
    saveTask();
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1);
    renderTasks();
    saveTask();
}

function renderTasks() {
    const taskContainer = document.getElementById("taskContainer");
    taskContainer.textContent = "";
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum);
    })
}