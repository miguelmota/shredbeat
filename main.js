const path = require('path')
const url = require('url')
const electron = require('electron')
const GK = require('osx-global-keypress')
const menubar = require('menubar')

const debug = require('./lib/debug')

const globalShortcut = electron.globalShortcut

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// global keypress event receiver
const gk = new GK()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const mb = menubar({
  icon: __dirname + '/IconTemplate.png',
  dir: __dirname,
  index: 'file://' + __dirname + '/index.html',
  width: 500,
  height: 300,
  alwaysOnTop: true,
  preloadWindow: true,
  nodeIntegration: true,
  frame: false,
  transparent: true,
  darkTheme: true
})

mb.on('ready', function ready () {
  const windowShortcutKey = 'Command+S';
  const ret = globalShortcut.register(windowShortcutKey, () => {
    debug(windowShortcutKey, 'is pressed')
  })

  if (!ret) {
    debug('registration failed for', windowShortcutKey)
  } else {
    debug('registered', globalShortcut.isRegistered(windowShortcutKey))
  }

  // start global keypress listener
  gk.start()

  gk.on('press', (data) => {
    debug(data);

    mb.window.webContents.send('keypress', true)
  })

  gk.on('error', (error) => {
    debug(error);
  });

  gk.on('close', () => {
    debug('gk closed');
  })

})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.NODE_ENV === 'development') {
    if (mainWindow.webContents) {
      // Open the DevTools.
      mainWindow.webContents.openDevTools()
    }
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
.on('ready', createWindow)
// Quit when all windows are closed.
.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()

  // stop global keypress listener
  gk.stop()
})
