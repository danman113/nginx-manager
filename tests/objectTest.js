var scopeParse = require( '../index.js' ).parse;
var fs = require( 'fs' );
var nginx = fs.readFileSync( 'example.conf', 'utf8' );
var testAmount = 1000;
var stmtAmount = 100000;
console.time( 'Testing addStatement' );
for(var i = 0; i < testAmount; i++) {
	var config = scopeParse( 'server / { proxy_buffers 4 32k; }' );
	for(var x = 0; x < stmtAmount; x++ ){
		config.addStatement('stmnt', ['value']);
	}
}
console.timeEnd( 'Testing addStatement' );