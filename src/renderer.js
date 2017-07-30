const { promisify } = require('util')
const fs = require('fs')
const showdown = require('showdown')

class MarkdownRenderer {
  constructor (callback) {
    this.callback = callback
    this.converter = new showdown.Converter()
  }

  loadFile (fileName) {
    if (this.watcher) {
      this.watcher.close()
    }
    this.watcher = fs.watch(fileName, () => {
      const markdown = fs.readFileSync(fileName, 'utf8')
      Promise.resolve(this.load(markdown))
    })

    const markdown = fs.readFileSync(fileName, 'utf8')
    return this.load(markdown)
  }

  load (markdown) {
    return this.convert(markdown).then((html) => {
      return this.callback(html)
    }).catch((error) => {
      throw error
    })
  }

  convert (markdown) {
    return promisify((markdown, callback) => {
      var html = this.converter.makeHtml(markdown)
      html = '<div class="markdown-body">' + html + '</div>'
      callback(null, html)
    })(markdown)
  }
}

exports.MarkdownRenderer = MarkdownRenderer
