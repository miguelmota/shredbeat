var electron = require('electron')
var path = require('path')
var url = require('url')
var menubar = require('menubar')
const defaultMenu = require('electron-default-menu')

var debug = require('./lib/debug')
var keyPressLogger = require('./lib/keyPressLogger')

var globalShortcut = electron.globalShortcut

// Module to control application life.
var app = electron.app
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow
// Native Menu
var Menu = electron.Menu
var shell = electron.shell

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow

var mb = menubar({
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
  debug('app ready')

  var windowShortcutKey = 'Command+S';
  var ret = globalShortcut.register(windowShortcutKey, () => {
    debug(windowShortcutKey, 'is pressed')
  })

  if (!ret) {
    debug('registration failed for', windowShortcutKey)
  } else {
    debug('registered', globalShortcut.isRegistered(windowShortcutKey))
  }

  var menu = defaultMenu(app, shell)

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  debug('menu set')

  // make sure this is at bottom of this function
  keyPressLogger.start({
    onPress: (data) => {
      mb.window.webContents.send('keypress', true)
    }
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

  keyPressLogger.stop()
})
