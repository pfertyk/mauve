const MarkdownRenderer = require('../src/renderer').MarkdownRenderer

describe ('Renderer', () => {
  var renderer
  var callback

  beforeEach(() => {
    callback = jasmine.createSpy('callback')
    renderer = new MarkdownRenderer(callback)
  })

  it('converts a markdown file', (done) => {
    const markdownFilePath = __dirname + '/test_readme.md'
    const expectedMarkdown = '^[^<>]*<div class="markdown-body"><h1 id="hello">Hello</h1></div>$'

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(callback.calls.mostRecent().args[0]).toMatch(expectedMarkdown)
      done()
    }, done.fail)
  })

  it('converts a markdown string', (done) => {
    var markdown = '## Hi'
    const expectedMarkdown = '^[^<>]*<div class="markdown-body"><h2 id="hi">Hi</h2></div>$'

    renderer.load(markdown).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(callback.calls.mostRecent().args[0]).toMatch(expectedMarkdown)
      done()
    }, done.fail)
  })
})
