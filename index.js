var parser = require( './src/parser/parser.js' );
var manager = require( './src/manager/manager.js' );

module.exports = {};
module.exports.parse = parser.parse;
module.exports.newBlock = parser.newBlock;
module.exports.Manager = manager;
