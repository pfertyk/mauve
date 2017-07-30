const files = {}
const watchers = {}

module.exports = {
  writeFileSync (file, data) {
    files[file] = data
    if (watchers[file]) {
      watchers[file]('change', file)
    }
  },
  watch (filename, listener) {
    watchers[filename] = listener
  },
  readFile (filename, encoding, callback) {
    callback(null, files[filename])
  }
}
