var fs = require('fs')

var nginx = require('../../index.js')

// Creates our base block of nginx
var b = nginx.newBlock()

// Add statements to the global scope
b.addStatement('user', 'root')
  .addStatement('worker_processes', 2)
  .addStatement('error_log', '/var/log/log.log', 'info')

// Add recursive blocks
var h = b.addBlock('http')
h.addStatement('gizp', 'on')
  .addStatement('gzip_min_length', 100)
  .addStatement('gzip_buffers', 4, '8k')

// Null blocks simply group arguments.
h.addBlock()
  .addStatement('sendfile', 'on')
  .addStatement('tcp_nopush', 'on')
  .addStatement('tcp_nodelay', 'on')

var s = h.addBlock('server')
s.addStatement('listen', 80)
  .addStatement('server_name', 'www.example.com', 'example.com')
  .addStatement('error_page', 404, '/404.html')

// You can just pass in strings with spaces if you want.
var home = s.addBlock('location / ')
home
  .addStatement('proxy_pass', 'http://127.0.0.1')
  .addStatement('proxy_redirect', 'off')
  .addStatement('proxy_set_header', 'Host $host')

// Pass in arrays for extra speed.
var images = s.addBlock('location ~* \\.(jpg|jpeg|gif)$')
images
  .addStatement('access_log', ['var/log/nignx-images.log', 'download'])
  .addStatement('root', '/www/images')

console.log(b.toString())

console.log(fs.readFileSync('small.conf', 'utf8') == b.toString())
