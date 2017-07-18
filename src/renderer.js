const Promise = require('bluebird')
const readFile = Promise.promisify(require('fs').readFile)
const showdown = require('showdown')

class MarkdownRenderer {
  constructor (callback) {
    this.callback = callback
  }

  loadFile (fileName) {
    return readFile(fileName, 'utf8').then((markdown) => {
      var converter = new showdown.Converter()
      var html = converter.makeHtml(markdown)
      html = '<div class="markdown-body">' + html + '</div>'
      html = 'data:text/html;charset=UTF-8,' + html
      return html
    }).then((html) => {
      this.callback(html)
    }).catch((error) => {
      throw error
    })
  }
}

exports.MarkdownRenderer = MarkdownRenderer
