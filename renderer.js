const fs = require('fs')
const showdown = require('showdown')

exports.reloadMarkdownFile = function (markdownFileName, loadContentCallback) {
  fs.readFile(markdownFileName, 'utf8', function (err, markdown) {
    if (err) throw err

    var converter = new showdown.Converter()
    var html = converter.makeHtml(markdown)
    html = '<div class="markdown-body">' + html + '</div>'
    html = 'data:text/html;charset=UTF-8,' + html

    loadContentCallback(html)
  })
}
