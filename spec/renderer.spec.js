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
    const expectedHTML = 'data:text/html;charset=UTF-8,%3Cdiv%20class%3D%22markdown-body%22%3E%3Ch1%20id%3D%22hello%22%3EHello%3C%2Fh1%3E%3C%2Fdiv%3E'

    renderer.loadFile(markdownFilePath).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(callback.calls.mostRecent().args[0]).toEqual(expectedHTML)
      done()
    }, done.fail)
  })

  it('converts a markdown string', (done) => {
    var markdown = '## Hi'
    const expectedHTML = 'data:text/html;charset=UTF-8,%3Cdiv%20class%3D%22markdown-body%22%3E%3Ch2%20id%3D%22hi%22%3EHi%3C%2Fh2%3E%3C%2Fdiv%3E'

    renderer.load(markdown).then(() => {
      expect(callback.calls.count()).toEqual(1)
      expect(callback.calls.mostRecent().args[0]).toEqual(expectedHTML)
      done()
    }, done.fail)
  })
})
