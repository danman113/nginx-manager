var parser = require('./src/parser/parser.js')
var manager = require('./src/manager/manager.js')

var _export = {
  parse: parser.parse,
  newBlock: parser.newBlock,
  Manager: manager
}

module.exports = _export
