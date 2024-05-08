const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { exec, spawn } = require('child_process');
const { join } = require("path");
const { promisify } = require('util');
const sudo = require('sudo-prompt');

const execPromise = promisify(exec);

let pythonProcess;
let mainWindow;
let loadingWindow;

function createLoadingWindow() {
    loadingWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    loadingWindow.loadFile(join(__dirname, 'loading.html'));
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    });

    mainWindow.loadFile(join(__dirname, 'index.html'));

    ipcMain.on('run-python', (event, folderPath, type, plots) => {
        try {
            process.chdir(folderPath);
            console.log('New directory: ' + process.cwd());
        }
        catch (err) {
            console.log('chdir: ' + err);
        }

        // Run the Python script based on the 'type' argument
        const pythonPath = join(__dirname, 'venv', 'bin', 'python');
        const scriptPath = join(__dirname, 'venv', 'bin', 'ctdfjorder-cli');
        let args;

        if (type === 'merge') {
            args = ['merge'];
        } else if (type === 'default') {
            args = ['default', plots || 'False'];
        } else {
            console.error('Invalid type argument:', type);
            return;
        }
        console.log(pythonPath)
        console.log(scriptPath)
        console.log(args)
        pythonProcess = spawn(pythonPath, [scriptPath, ...args], {
            stdio: 'ignore',
        });

        pythonProcess.on('close', (code) => {
            console.log('Python script exited with code', code);
            mainWindow.webContents.send('python-done');
        });
    });
}

async function setupEnvironment() {
    createLoadingWindow();

    const venvPath = join(__dirname, 'venv');

    try {
        // Check if virtual environment exists using sudo-prompt
        sudo.exec(`test -d "${venvPath}"`, {name: 'Electron'},
            function(error, stdout, stderr) {
                if (error) {
                    console.log('Virtual environment does not exist. Creating...');
                    try {
                        // Create virtual environment with Python 3.11 using sudo-prompt
                        const createVenvCommand = `python3.11 -m venv ${venvPath}`;
                        console.log(createVenvCommand)
                        sudo.exec(createVenvCommand, {name: 'Electron'},
                            function(error, stdout, stderr) {
                                if (error) {
                                    console.error('Failed to create virtual environment:', stderr);
                                    dialog.showErrorBox('Permission Denied', 'Failed to create virtual environment. Please run the app as an administrator.');
                                    app.quit();
                                } else {
                                    console.log('Virtual environment created successfully with Python 3.11.');
                                    installPackage();
                                }
                            }
                        );
                    } catch (error) {
                        console.error('Failed to create virtual environment. Please run the app as an administrator.', error);
                        dialog.showErrorBox('Permission Denied', 'Failed to create virtual environment. Please run the app as an administrator.');
                        app.quit();
                        return;
                    }
                } else {
                    console.log('Virtual environment already exists.');
                    // Proceed with package installation
                    installPackage();
                }
            }
        );
    } catch (error) {
        console.error('Failed to check virtual environment existence. Please run the app as an administrator.', error);
        dialog.showErrorBox('Permission Denied', 'Failed to check virtual environment existence. Please run the app as an administrator.');
        app.quit();
        return;
    }
}

async function installPackage() {
    const venvPath = join(__dirname, 'venv');

    // Install ctdfjorder package using sudo-prompt
    const installCommand = `${join(venvPath, 'bin', 'python')} -m pip install ctdfjorder==0.0.43`;
    console.log(installCommand)
    sudo.exec(installCommand, {name: 'Electron'},
        function(error, stdout, stderr) {
            if (error) {
                console.error('Failed to install ctdfjorder package:', stderr);
                dialog.showErrorBox('Permission Denied', 'Failed to install ctdfjorder package. Please run the app as an administrator.');
                app.quit();
            } else {
                console.log('ctdfjorder package installed successfully.');
                loadingWindow.close();
                createMainWindow();
                mainWindow.once('ready-to-show', () => {
                    mainWindow.show();
                });
            }
        }
    );
}

app.whenReady().then(setupEnvironment);

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
        createMainWindow();
    }
});
