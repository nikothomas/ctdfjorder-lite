const { ipcRenderer } = require('electron');

const loadingTextOptions = [
    "Processing data...",
    "Analyzing files...",
    "Crunching numbers...",
    "Almost there...",
    "Just a moment..."
];

let loadingTextInterval;

document.addEventListener('DOMContentLoaded', () => {
    const mergeDropbox = document.getElementById('mergeDropbox');
    const defaultDropbox = document.getElementById('defaultDropbox');
    const defaultPlotsDropbox = document.getElementById('defaultPlotsDropbox');

    mergeDropbox.addEventListener('drop', (event) => {
        event.preventDefault();
        const folderPath = event.dataTransfer.files[0].path;
        showLoadingOverlay();
        ipcRenderer.send('run-python', folderPath, 'merge');
    });

    defaultDropbox.addEventListener('drop', (event) => {
        event.preventDefault();
        const folderPath = event.dataTransfer.files[0].path;
        showLoadingOverlay();
        ipcRenderer.send('run-python', folderPath, 'default');
    });

    defaultPlotsDropbox.addEventListener('drop', (event) => {
        event.preventDefault();
        const folderPath = event.dataTransfer.files[0].path;
        showLoadingOverlay();
        ipcRenderer.send('run-python', folderPath, 'default', 'True');
    });

    mergeDropbox.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    defaultDropbox.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    defaultPlotsDropbox.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    ipcRenderer.on('python-done', () => {
        hideLoadingOverlay();
    });
});

function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    let currentIndex = 0;

    loadingOverlay.style.display = 'flex';
    loadingText.textContent = loadingTextOptions[currentIndex];

    loadingTextInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingTextOptions.length;
        loadingText.textContent = loadingTextOptions[currentIndex];
    }, 5000);
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
    clearInterval(loadingTextInterval);
}