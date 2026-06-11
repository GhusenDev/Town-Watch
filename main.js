const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require("electron");
const WebSocket = require("ws");

app.disableHardwareAcceleration();

let latestData = null;
let ws = null;

let currentProfile = "8793414";
let win = null;

// 🔥 3 MODE STATE
// 0 = SETUP
// 1 = HUD
// 2 = HIDE
let mode = 0;

function createWindow() {

  const { width } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 520,
    height: 110,

    frame: false,
    transparent: true,
    backgroundColor: "#00000000",

    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    show: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    }
  });

  win.setAlwaysOnTop(true, "screen-saver");
  win.setPosition(width - 540, 20);

  win.loadFile("index.html");
}

function startWS(profileId) {

  currentProfile = profileId;

  if (ws) ws.close();

  ws = new WebSocket(
    `wss://socket.aoe2companion.com/listen?handler=ongoing-matches&profile_ids=${profileId}`
  );

  ws.on("message", (data) => {
    try {
      latestData = JSON.parse(data.toString());
    } catch {
      latestData = null;
    }
  });
}

ipcMain.handle("get-live-data", () => latestData);

ipcMain.handle("start-profile", (e, profileId) => {
  startWS(profileId);
});

app.whenReady().then(() => {

  createWindow();
  startWS(currentProfile);

  globalShortcut.register("F8", () => {

    if (!win || win.isDestroyed()) return;

    mode = (mode + 1) % 3;

    if (mode === 0) {
      win.setIgnoreMouseEvents(false);
      win.webContents.send("mode", "setup");
    }

    if (mode === 1) {
      win.setIgnoreMouseEvents(true, { forward: true });
      win.webContents.send("mode", "hud");
    }

    if (mode === 2) {
      win.setIgnoreMouseEvents(true, { forward: true });
      win.webContents.send("mode", "hide");
    }

    console.log("MODE:", mode);
  });

});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});