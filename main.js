const electron = require('electron')
const fs = require('fs')
const shell = require('electron').shell
const renderer = require('./renderer')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

function createWindow () {
  var markdownFileName = process.argv[2] || 'README.md'

  mainWindow = new BrowserWindow({title: 'MD Reader', autoHideMenuBar: true})

  renderer.reloadMarkdownFile(mainWindow, markdownFileName)

  fs.watch(markdownFileName, function () {
    renderer.reloadMarkdownFile(mainWindow, markdownFileName)
  })

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function handleRedirect (e, url) {
  e.preventDefault()
  if (/^file:\/\//.test(url)) {
    url = url.replace(/^file:\/\//, '')
    renderer.reloadMarkdownFile(mainWindow, url)
  }
  else if(url != mainWindow.webContents.getURL()) {
    shell.openExternal(url)
  }
}
