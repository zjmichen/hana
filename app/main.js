const electron = require('electron');
const fs = require('fs');
const path = require('path');
const debounce = require('debounce');
const watch = require('watch');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const nativeImage = electron.nativeImage;
const shell = electron.shell;
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
        let f = inputLoader.outputs.find((output) => output.type === toType);
        if (f.transform) {
          return f.transform(data);
        } else {
          throw new Error(`Can\'t convert to ${toType}`);
        }
      })
      .then((output) => resolve(output))
      .catch((error) => reject(error));
  });
}

function loadPlugin(type) {
  return new Promise((resolve, reject) => {
    const pluginFolder = getPluginFolder();

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
    event.sender.send('addplugin_error', 'Invalid plugin');
    return;
  }

  const pluginFolder = getPluginFolder();

  const destFile = pluginFolder + path.sep + path.basename(sourceFile);
  copyFile(sourceFile, destFile).then(() => {
    event.sender.send('addplugin', {
      name: plugin.name,
      type: path.basename(sourceFile, '.js'),
      outputTypes: plugin.outputTypes
    });
  });
});

ipcMain.on('createplugin', (event) => {
  const appFolder = (process.env.ENV === 'development')
    ? path.resolve('./app')
    : app.getAppPath();
  const pluginFolder = getPluginFolder();

  const pluginTemplate = appFolder + path.sep + 'template.js';
  const newPlugin = pluginFolder + path.sep + 'new_plugin.js';

  copyFile(pluginTemplate, newPlugin)
    .then(() => {
      watch.createMonitor(pluginFolder, (monitor) => {
        monitor.on('created', (file) => {
          monitor.stop();
          const plugin = require(file);
          if (!validPlugin(plugin)) return;

          debounce(() => {
            event.sender.send('createplugin', {
              name: plugin.name,
              type: path.basename(file, '.js'),
              outputTypes: plugin.outputTypes
            });
          })();
        });
      });
      shell.openItem(newPlugin);
      setTimeout(() => fs.unlink(newPlugin), 500);
    });
});

function validPlugin(plugin) {
  if (!plugin.name) return false;
  if (!plugin.outputs) return false;
  if (!Array.isArray(plugin.outputs)) return false;
  const validOutputs = getValidOutputs(plugin.outputs);
  if (validOutputs.length === 0) return false;
  return true;
}

function getValidOutputs(outputs) {
  return outputs.filter((output) => {
    return output.hasOwnProperty('name')
      && output.hasOwnProperty('type')
      && output.hasOwnProperty('transform')
      && typeof(output.transform === 'function');
  });
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
  const pluginFolder = getPluginFolder();

  loadPlugins(pluginFolder)
    .then((plugins) => {
      event.sender.send('getplugins', plugins);
    })
    .catch((error) => {
      console.error(error);
    });
});

function loadPlugins(pluginFolder) {
  return new Promise((resolve, reject) => {
    let plugins = [];
    fs.readdir(pluginFolder, (err, files) => {
      if (err) reject(err);
      files = files || [];
      files.forEach((file) => {
        if (path.extname(file) !== '.js') return;

        const plugin = require(`${pluginFolder}/${file}`);
        if (!plugin.outputs) return;

        plugins.push({
          name: plugin.name || path.basename(file, '.js'),
          type: path.basename(file, '.js'),
          outputs: getValidOutputs(plugin.outputs)
        });
      });
      resolve(plugins);
    });
  });
}

function getPluginFolder(user) {
  return (process.env.ENV === 'development')
    ? path.resolve('./app/plugins')
    : user
      ? app.getPath('userData') + path.sep + 'plugins'
      : app.getAppPath() + path.sep + 'plugins';
}