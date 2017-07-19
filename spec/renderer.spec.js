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
    const markdownFilePath = path.join(__dirname, 'md/header.md')
    const expectedHtml = '^[^<]*<div class="markdown-body"><h1 id="hello">Hello</h1></div>$'

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(decodeURIComponent(callback.calls.mostRecent().args[0])).toMatch(expectedHtml)
      done()
    }, done.fail)
  })

  it('converts a markdown string', (done) => {
    var markdown = '## Hi'
    const expectedHtml = '^[^<]*<div class="markdown-body"><h2 id="hi">Hi</h2></div>$'

    renderer.load(markdown).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(decodeURIComponent(callback.calls.mostRecent().args[0])).toMatch(expectedHtml)
      done()
    }, done.fail)
  })

  it('preserves new lines in code', (done) => {
    const markdownFilePath = path.join(__dirname, 'md/code.md')
    const expectedHtml = '^[^<]*<div class="markdown-body"><pre><code>var x = 3\nvar y = null\n</code></pre></div>'

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(decodeURIComponent(callback.calls.mostRecent().args[0])).toMatch(expectedHtml)
      done()
    }, done.fail)
  })
})
