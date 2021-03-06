const electron = require('electron')
const fs = require('fs')
const path = require('path')
const shell = require('electron').shell

const { MarkdownRenderer } = require('./renderer')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

const reloadWindow = html => {
  var url = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html)
  mainWindow.loadURL(url)
}

const renderer = new MarkdownRenderer(reloadWindow)

const createWindow = () => {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '..', 'resources', 'icon.png'),
    title: 'Mauve', autoHideMenuBar: true
  })

  mainWindow.on('closed', () => { mainWindow = null })
  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('did-finish-load', loadCSS)

  var markdownFileName = process.argv[process.defaultApp ? 2 : 1]
  if (markdownFileName) {
    renderer.loadFile(markdownFileName)
  } else {
    renderer.load('# Welcome in Mauve!\n\nDrag files here to view them')
  }

  electron.globalShortcut.register('CommandOrControl+q', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

const loadCSS = () => {
  fs.readFile(path.join(__dirname, 'github.css'), 'utf8', (err, css) => {
    if (err) throw err

    mainWindow.webContents.insertCSS(css)
  })
}

const handleRedirect = (e, url) => {
  e.preventDefault()
  if (/^file:\/\//.test(url)) { // drag and drop
    mainWindow.setTitle(url.split('/').pop())
    url = url.replace(/^file:\/\//, '')
    renderer.loadFile(url)
  }
  else if(url != mainWindow.webContents.getURL()) { // external link
    shell.openExternal(url)
  }
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
