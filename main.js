const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')
const showdown = require('showdown')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'MD Reader'})

  var markdownFileName = 'README.md'

  reloadMarkdownFile(markdownFileName)

  fs.watchFile(markdownFileName, (curr, prev) => {
    reloadMarkdownFile(markdownFileName)
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function reloadMarkdownFile(markdownFileName) {
  fs.readFile(markdownFileName, 'utf8', function (err, markdown) {
    if (err) throw err

    var converter = new showdown.Converter()
    var html = converter.makeHtml(markdown);
    html = '<div class="markdown-body">' + html + '</div>'

    fs.writeFile('test.html', html, function (err) {
      if (err) throw err

      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'test.html'),
        protocol: 'file:',
        slashes: true
      }))

      var cssPath = 'node_modules/github-markdown-css/github-markdown.css'

      fs.readFile(path.join(__dirname, cssPath), 'utf8', function (err, css) {
        if (err) throw err

        mainWindow.webContents.on('did-finish-load', function() {
          mainWindow.webContents.insertCSS(css)
        });
      })
    })
  })
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
