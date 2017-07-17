const electron = require('electron')
const fs = require('fs')
const path = require('path')
const renderer = require('./renderer')
const shell = require('electron').shell

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

const reloadWindow = (url) => {
  mainWindow.loadURL(url)
}

const createWindow = () => {
  var markdownFileName = process.argv[2] || 'README.md'

  mainWindow = new BrowserWindow({title: 'MD Reader', autoHideMenuBar: true})

  var cssPath = 'node_modules/github-markdown-css/github-markdown.css'

  fs.readFile(path.join(__dirname, cssPath), 'utf8', (err, css) => {
    if (err) throw err

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.insertCSS(css)
    })
  })

  renderer.reloadMarkdownFile(markdownFileName, reloadWindow)

  fs.watch(markdownFileName, () => {
    renderer.reloadMarkdownFile(markdownFileName, reloadWindow)
  })

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const handleRedirect = (e, url) => {
  e.preventDefault()
  if (/^file:\/\//.test(url)) {
    url = url.replace(/^file:\/\//, '')
    renderer.reloadMarkdownFile(url, reloadWindow)
  }
  else if(url != mainWindow.webContents.getURL()) {
    shell.openExternal(url)
  }
}
