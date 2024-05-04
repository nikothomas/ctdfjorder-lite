const { app, BrowserWindow, ipcMain } = require('electron');
const { exec, spawn } = require('child_process');
const { join } = require("path");

let pythonProcess;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    ipcMain.on('run-python', (event, folderPath, type, plots) => {
        try {
            process.chdir(folderPath);
            console.log('New directory: ' + process.cwd());
        }
        catch (err) {
            console.log('chdir: ' + err);
        }

        // Run the Python script
        const pythonPath = join(__dirname, 'venv/bin/python');
        const scriptPath = join(__dirname, 'venv/bin/CTDFjorder-cli');
        const args = [type, plots || 'False'];

        pythonProcess = spawn(pythonPath, [scriptPath, ...args], {
            stdio: 'ignore',
        });

        pythonProcess.on('close', (code) => {
            console.log('Python script exited with code', code);
            mainWindow.webContents.send('python-done');
        });
    });
}

app.whenReady().then(() => {
    // ... (rest of the code for creating virtual environment and installing package)
});

app.on('window-all-closed', () => {
    // Kill the Python subprocess if it's still running
    if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill();
        console.log('Python process was terminated');
    }
    app.quit();
});

app.on('before-quit', () => {
    // Kill the Python subprocess if it's still running
    if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill();
        console.log('Python process was terminated');
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});