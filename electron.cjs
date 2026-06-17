
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win = null;

function createWindow() {
  if (win) return; // Prevention: only one window

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In production, load the local index.html file
  // In development, load the vite dev server URL (e.g., localhost:5173)
  const loadUrl = () => {
    win.loadURL('http://localhost:5173').catch((err) => {
      console.error('Erro ao carregar URL do Vite, tentando novamente...', err);
      setTimeout(loadUrl, 2000);
    });
  };

  if (process.env.NODE_ENV === 'development') {
    loadUrl();
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(`Falha ao carregar: ${errorDescription} (${errorCode})`);
      setTimeout(loadUrl, 2000);
    });
  } else {
    win.loadFile(path.join(__dirname, 'out/renderer/index.html'));
  }

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
