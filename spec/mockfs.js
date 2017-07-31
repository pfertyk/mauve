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
    return { close: () => { delete watchers[file] } }
  },
  readFileSync (file) {
    return files[file]
  }
}
