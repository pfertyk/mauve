const Promise = require('bluebird')
const readFile = Promise.promisify(require('fs').readFile)
const showdown = require('showdown')

class MarkdownRenderer {
  constructor (callback) {
    this.callback = callback
    this.converter = new showdown.Converter()
  }

  loadFile (fileName) {
    return readFile(fileName, 'utf8').then((markdown) => {
      return this.load(markdown)
    })
  }

  load (markdown) {
    return this.convert(markdown).then((html) => {
      return this.callback(html)
    }).catch((error) => {
      throw error
    })
  }

  convert (markdown) {
    return Promise.promisify((markdown, callback) => {
      var html = this.converter.makeHtml(markdown)
      html = '<div class="markdown-body">' + html + '</div>'
      html = 'data:text/html;charset=UTF-8,' + html
      callback(null, html)
    })(markdown)
  }
}

exports.MarkdownRenderer = MarkdownRenderer
