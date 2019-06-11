var parser = require( './src/parser/parser.js' );
var manager = require( './src/manager/manager.js' );

var _export = {
    parse: parse.parse,
    newBlock: parser.newBlock,
    Manager: manager
}

module.exports = _export;
