var scopeParse = require('../index.js').parse
var fs = require('fs')
var nginx = fs.readFileSync('example.conf', 'utf8')

var config = scopeParse(nginx)
console.time('smalltest')
var str = config.toString()
console.timeEnd('smalltest')
fs.writeFileSync('testStringOutput.conf', str, 'utf8')
