const electron = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const showdown = require('showdown')
const temp = require('temp')
const shell = require("electron").shell

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({title: 'MD Reader'})

  mainWindow.webContents.on('will-navigate', handleRedirect)

  var markdownFileName = 'README.md'

  reloadMarkdownFile(markdownFileName)

  fs.watch(markdownFileName, function () {
    reloadMarkdownFile(markdownFileName)
  });

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

function reloadMarkdownFile(markdownFileName) {
  fs.readFile(markdownFileName, 'utf8', function (err, markdown) {
    if (err) throw err

    var converter = new showdown.Converter()
    var html = converter.makeHtml(markdown);
    html = '<div class="markdown-body">' + html + '</div>'

    const tempHtmlPath = temp.path({suffix: '.html'})

    fs.writeFile(tempHtmlPath, html, function (err) {
      if (err) throw err

      mainWindow.loadURL(url.format({
        pathname: tempHtmlPath,
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

function handleRedirect (e, url) {
  if(url != mainWindow.webContents.getURL()) {
    e.preventDefault()
    shell.openExternal(url)
  }
}
