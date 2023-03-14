const path = require("path");
const cors = require("cors");
const fs = require("fs");

//const { app, BrowserWindow } = require("electron");
const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut,
  nativeImage,
} = require("electron");
console.log(app.getPath("appData"));
const isDev = require("electron-is-dev");

const log = require("electron-log");

let window;
let isQuiting;
let tray;

app.on("before-quit", function () {
  isQuiting = true;
});

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 2560,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    },
  });
  win.maximize();

  const imgPath = path.join(process.resourcesPath, 'logo192.png')
  const trayDirectory = nativeImage.createFromPath(
    path.join(__dirname, "../assets/logo192.png")
  );
  tray = new Tray(isDev ? trayDirectory : imgPath);

  tray.on("click", () => {
    win.show();
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: function () {
          win.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          isQuiting = true;
          app.quit();
        },
      },
    ])
  );

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : "file:///" + __dirname + `/../build/index.html`
  );

  win.on("close", function (event) {
    if (!isQuiting) {
      event.preventDefault();
      win.hide();
      event.returnValue = false;
    }
  });

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  console.log(
    "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
  );
  const win = createWindow();
  globalShortcut.register("CommandOrControl+Shift+Alt+H", () => {
    win.show();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("/teste", (request, response) => {
  console.log("puts, era isso mesmo");
  response.json("eae");
});
