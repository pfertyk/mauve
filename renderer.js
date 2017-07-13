const fs = require('fs')
const path = require('path')
const showdown = require('showdown')

exports.reloadMarkdownFile = function (mainWindow, markdownFileName) {
  fs.readFile(markdownFileName, 'utf8', function (err, markdown) {
    if (err) throw err

    var converter = new showdown.Converter()
    var html = converter.makeHtml(markdown)
    html = '<div class="markdown-body">' + html + '</div>'
    html = 'data:text/html;charset=UTF-8,' + html

    mainWindow.loadURL(html)

    var cssPath = 'node_modules/github-markdown-css/github-markdown.css'

    fs.readFile(path.join(__dirname, cssPath), 'utf8', function (err, css) {
      if (err) throw err

      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.insertCSS(css)
      })
    })
  })
}
