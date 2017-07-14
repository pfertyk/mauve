const electron = require('electron')
const fs = require('fs')
const path = require('path')
const renderer = require('./renderer')
const shell = require('electron').shell

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

function reloadWindow(url) {
  mainWindow.loadURL(url)
}

function createWindow () {
  var markdownFileName = process.argv[2] || 'README.md'

  mainWindow = new BrowserWindow({title: 'MD Reader', autoHideMenuBar: true})

  var cssPath = 'node_modules/github-markdown-css/github-markdown.css'

  fs.readFile(path.join(__dirname, cssPath), 'utf8', function (err, css) {
    if (err) throw err

    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.insertCSS(css)
    })
  })

  renderer.reloadMarkdownFile(markdownFileName, reloadWindow)

  fs.watch(markdownFileName, function () {
    renderer.reloadMarkdownFile(markdownFileName, reloadWindow)
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
    renderer.reloadMarkdownFile(url, reloadWindow)
  }
  else if(url != mainWindow.webContents.getURL()) {
    shell.openExternal(url)
  }
}
