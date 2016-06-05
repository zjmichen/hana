const electron = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const nativeImage = electron.nativeImage;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  const icon = nativeImage.createFromPath('images/app_icon.png');
  mainWindow = new BrowserWindow({width: 900, height: 600});
  mainWindow.setIcon(icon);
  mainWindow.setMenu(null);
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  
  if (process.env.ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('choosefile', (event) => {
  const file = dialog.showOpenDialog({title: 'Choose File'});
  event.sender.send('choosefile', file);
});

ipcMain.on('transform', (event, options) => {
  transform(options.fromType, options.toType, options.data)
    .then((output) => event.sender.send('transform', output))
    .catch((error) => event.sender.send('error', error.message || error));
});

function transform(fromType, toType, data) {
  return new Promise((resolve, reject) => {
    loadPlugin(fromType)
      .then((inputLoader) => {
        if (inputLoader[`to_${toType}`]) {
          return inputLoader[`to_${toType}`](data);
        } else {
          let outputLoader;
          return loadPlugin(toType)
            .then((loader) => {
              outputLoader = loader;
              return inputLoader.deserialize(data);
            })
            .then((data) => outputLoader.serialize(data))
            .catch((error) => reject(error));
        }
      })
      .then((output) => resolve(output))
      .catch((error) => reject(error));
  });
}

function loadPlugin(type) {
  return new Promise((resolve, reject) => {
    const pluginFolder = (process.env.ENV === 'development')
      ? './plugins'
      : app.getPath('userData');

    const plugin = require(`${pluginFolder}/${type}`);
    if (!plugin) reject(`No loader found for ${type}`);
    if (!plugin.deserialize || !plugin.serialize) reject(`Invalid loader for ${type}`);
    resolve(plugin);
  });
}