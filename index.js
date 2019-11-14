const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: "Add New Todo",
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on("todo:add", (event, todo) => {
  console.log("yep");
  mainWindow.webContents.send("todo:add", todo);
  addWindow.close();
});

let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "Extra",
    submenu: [
      {
        label: "Toggle Developer Tools",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
