var scopeParse = require('../../index.js').parse
var fs = require('fs')
var nginx = fs.readFileSync('example.conf', 'utf8')
var testAmount = 100000
console.time('smalltest')
for (var i = 0; i < testAmount; i++) {
  var config = scopeParse('server / { proxy_buffers 4 32k; }')
}
console.timeEnd('smalltest')
console.time('largetest')
for (var i = 0; i < testAmount; i++) {
  var config = scopeParse(nginx)
}
console.timeEnd('largetest')
// console.log(config);
