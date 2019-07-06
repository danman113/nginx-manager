var nginx = require('../../index.js')

var manager = nginx.Manager({
  sitePath: './nginx/sites-available',
  symlinkPath: './nginx/sites-enabled'
})

manager.reload().then(
  function(stdout, stderr) {
    console.log(stderr, stdout)
  },
  function(err) {
    console.log(err)
  }
)
