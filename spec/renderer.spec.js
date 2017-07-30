const proxyquire = require('proxyquire')
const mockfs = require('./mockfs')
const { MarkdownRenderer } = proxyquire('../src/renderer', { 'fs': mockfs })

describe ('Renderer', () => {
  var renderer
  var callback

  beforeEach(() => {
    callback = jasmine.createSpy('callback')
    renderer = new MarkdownRenderer(callback)
  })

  it('converts a markdown file', (done) => {
    const path = 'header.md'
    mockfs.writeFileSync(path, '# Hello')

    renderer.loadFile(path).then(() => {
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
    const path = 'code.md'
    mockfs.writeFileSync(path, '```\nvar x = 3\nvar y = null\n```')

    renderer.loadFile(path).then(() => {
      expect(callback).toHaveBeenCalledWith(
        '<div class="markdown-body"><pre><code>var x = 3\nvar y = null\n</code></pre></div>'
      )
      done()
    }, done.fail)
  })

  it('watches loaded file', (done) => {
    const path = 'file.md'
    mockfs.writeFileSync(path, 'original')

    renderer.loadFile(path)
      .then(() => {
        mockfs.writeFileSync('file.md', 'changed')
      })
      .then(() => {
        expect(callback.calls.mostRecent().args[0]).toEqual(
          '<div class="markdown-body"><p>changed</p></div>'
        )
        done()
      }, done.fail)
  })
})
