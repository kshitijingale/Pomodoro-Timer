const timeOption = document.getElementById("timeOption");
const saveBtn = document.getElementById("saveBtn");

timeOption.addEventListener("change", (event) => {
    const val = event.target.value;
    if (val < 1 || val > 60) {
        timeOption.value = 25;
    }
})

saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timeOption: timeOption.value,
        timer: 0,
        isRunning: false,
    })
})

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption;
})