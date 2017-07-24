const path = require('path')
const MarkdownRenderer = require('../src/renderer').MarkdownRenderer

describe ('Renderer', () => {
  var renderer
  var callback

  beforeEach(() => {
    callback = jasmine.createSpy('callback')
    renderer = new MarkdownRenderer(callback)
  })

  it('converts a markdown file', (done) => {
    const markdownFilePath = path.join(__dirname, 'md', 'header.md')

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback).toHaveBeenCalledWith(
        '<div class="markdown-body"><h1 id="hello">Hello</h1></div>'
      )
      done()
    }, done.fail)
  })

  it('converts a markdown string', (done) => {
    var markdown = '## Hi'

    renderer.load(markdown).then(() => {
      expect(callback).toHaveBeenCalledWith(
        '<div class="markdown-body"><h2 id="hi">Hi</h2></div>'
      )
      done()
    }, done.fail)
  })

  it('preserves new lines in code', (done) => {
    const markdownFilePath = path.join(__dirname, 'md', 'code.md')

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback).toHaveBeenCalledWith(
        '<div class="markdown-body"><pre><code>var x = 3\nvar y = null\n</code></pre></div>'
      )
      done()
    }, done.fail)
  })
})
