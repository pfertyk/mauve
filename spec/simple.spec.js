const renderer = require('../src/renderer')

describe ('Renderer', () => {
  var loadContentCallback

  beforeEach(() => {
    loadContentCallback = jasmine.createSpy('loadContentCallback')
  })

  it('converts a markdown file', (done) => {
    const markdownFilePath = __dirname + '/test_readme.md'
    const expectedMarkdown = '^[^<>]*<div class="markdown-body"><h1 id="hello">Hello</h1></div>$'

    renderer.reloadMarkdownFile(markdownFilePath, loadContentCallback).then(() => {
      expect(loadContentCallback.calls.count()).toEqual(1)
      expect(loadContentCallback.calls.mostRecent().args[0]).toMatch(expectedMarkdown)
      done()
    }, done.fail)
  })
})
