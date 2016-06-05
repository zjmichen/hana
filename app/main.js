const electron = require('electron');
const fs = require('fs');
const path = require('path');
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
    .catch((error) => event.sender.send('transform_error', error.message || error));
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
      ? path.resolve('./build/plugins')
      : app.getPath('userData');

    const plugin = require(`${pluginFolder}/${type}`);
    if (!plugin) reject(`No loader found for ${type}`);
    resolve(plugin);
  });
}

ipcMain.on('addplugin', (event) => {
  const files = dialog.showOpenDialog({
    title: 'Add Plugin',
    filters: [{
      name: 'Javascript Files',
      extensions: ['js']
    }]
  });

  if (!files || files.length === 0) return;
  const sourceFile = files[0];
  const plugin = require(sourceFile);

  if (!validPlugin(plugin)) {
    event.sender.send('addplugin_error', new Error('Invalid plugin'));
    return;
  }

  const pluginFolder = (process.env.ENV === 'development')
    ? path.resolve('./build/plugins')
    : app.getPath('userData');

  const destFile = pluginFolder + path.sep + path.basename(sourceFile);
  copyFile(sourceFile, destFile).then(() => {
    event.sender.send('addplugin', {
      name: plugin.name,
      type: path.basename(sourceFile, '.js'),
      outputTypes: plugin.outputTypes
    });
  });
});

function validPlugin(plugin) {
  if (!plugin.name) return false;
  if (!plugin.outputTypes) return false;
  if (!Array.isArray(plugin.outputTypes)) return false;
  const validOutputs = plugin.outputTypes.filter((type) =>
    plugin.hasOwnProperty(`to_${type.type}`));
  if (validOutputs.length === 0) return false;

  return true;
}

function copyFile(source, dest) {
  return new Promise((resolve, reject) => {
    const read = fs.createReadStream(source);
    const write = fs.createWriteStream(dest);
    read.on('error', reject);
    write.on('error', reject);
    write.on('finish', resolve);
    read.pipe(write);
  });
}

ipcMain.on('getplugins', (event) => {
  const pluginFolder = (process.env.ENV === 'development')
    ? path.resolve('./build/plugins')
    : app.getPath('userData');

  let plugins = [];
  fs.readdir(pluginFolder, (err, files) => {
    files = files || [];
    files.forEach((file) => {
      if (path.extname(file) !== '.js') return;

      const plugin = require(`${pluginFolder}/${file}`);
      if (!plugin.outputTypes) return;

      plugins.push({
        name: plugin.name || path.basename(file, '.js'),
        type: path.basename(file, '.js'),
        outputTypes: plugin.outputTypes.filter((type) =>
          plugin.hasOwnProperty(`to_${type.type}`))
      });
    });

    event.sender.send('getplugins', plugins);
  });
});