var fs = require( 'fs' );
var scopeParse = require( '../../index.js' ).parse;
var nginx = fs.readFileSync( 'example.conf', 'utf8' );
var repl = require( 'repl' );
var msg = 'message';

console.time( 'conf' );
var conf = scopeParse( nginx, true );
console.timeEnd( 'conf' );

repl.start( '> ' ).context.conf = conf;
