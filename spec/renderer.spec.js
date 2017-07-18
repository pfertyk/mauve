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

    renderer.loadFile(markdownFilePath, callback).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(callback.calls.mostRecent().args[0]).toMatch(expectedMarkdown)
      done()
    }, done.fail)
  })
})
