const files = {}
const watchers = {}

module.exports = {
  writeFileSync (file, data) {
    files[file] = data
    if (watchers[file]) {
      watchers[file]('change', file)
    }
  },
  watch (file, listener) {
    watchers[file] = listener
  },
  readFileSync (file) {
    return files[file]
  }
}
