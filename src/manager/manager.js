var fs = require('fs')
require('any-promise/register/q')
var path = require('path')
var parser = require('../parser/parser.js')
var q = require('q')
var fsp = require('fs-promise')
var exec = require('child_process').exec

module.exports = function(config) {
  return new manager(config)
}

var defaultValues = {
  nginxPath: '/usr/sbin/nginx',
  sitePath: '/etc/nginx/sites-available/',
  symlinkPath: '/etc/nginx/sites-enabled/'
}

// Custom error for testing purposes
function NginxManagerError(message) {
  this.name = 'NginxManagerError'
  this.message = message || 'Default Message'
  this.stack = new Error().stack
}
NginxManagerError.prototype = Object.create(Error.prototype)
NginxManagerError.prototype.constructor = NginxManagerError

/**
 * Main Manager class. Set a main directory and you can easily add and edit
 * sites in it.
 * @class
 * @param  {Object} config Config file. Defaults: <br/>
 *                         nginxPath: '/usr/sbin/nginx'<br/>
 *                         sitePath: '/etc/nginx/sites-available/'<br/>
 *                         symlinkPath: '/etc/nginx/sites-enabled/'
 */
function manager(config) {
  if (!config) config = {}

  for (var i in defaultValues) {
    if (!config[i]) config[i] = defaultValues[i]
  }

  this.config = config
}

/**
 * Adds a site, throws an error if one already exists.
 * @chainable
 * @param {String}	filename Filename of new site relative to directory
 * @param {Block}	conf     Conf that will compose the site.
 * @return {Promise}		in fail will return an error.
 */
manager.prototype.addSite = function(filename, conf) {
  var deferred = q.defer()
  var _this = this
  var filepath = path.normalize(path.join(this.config.sitePath, filename))

  fsp
    .access(filepath)
    .then(
      function(stat) {
        throw new NginxManagerError('File Already Exists. Please use editSite.')
      },
      function() {
        return fsp.writeFile(filepath, conf.toString(), 'utf8')
      }
    )
    .then(function(data) {
      if (_this.config.symlinkPath) {
        var sym = path.normalize(path.join(_this.config.symlinkPath, filename))
        return fsp.symlink(filepath, sym).then(
          function() {
            deferred.resolve()
          },
          function(e) {
            deferred.resolve()
          }
        )
      } else {
        deferred.resolve()
      }
    })
    .fail(function(err) {
      deferred.reject(err)
    })
  return deferred.promise
}

/**
 * Parses a site.
 * @chainable
 * @param  {String} filename Filename of new site relative to directory.
 * @return {Promise}         On success will return a Block of the requested
 *                           site. On fail will return an error.
 */
manager.prototype.parseSite = function(filename) {
  var deferred = q.defer()
  var _this = this
  var filepath = path.normalize(path.join(this.config.sitePath, filename))

  fs.readFile(filepath, 'utf8', function(err, data) {
    if (err) {
      deferred.reject(err)
    } else {
      var conf = parser.parse(data)
      deferred.resolve(conf)
    }
  })
  return deferred.promise
}

/**
 * Will reload nginx gracefully using the supplied nginxPath. Use sparingly.
 * @return {Promise}	On success will return stdout and stderr of call. On fail
 *                      will return error.
 */
manager.prototype.reload = function() {
  var deferred = q.defer()
  exec(this.config.nginxPath + ' -s reload', function(err, stdout, stderr) {
    if (err) {
      deferred.reject(err)
    } else {
      if (!stdout || stderr) {
        deferred.resolve(stdout, stderr)
      } else {
        deferred.reject(stdout, stderr)
      }
    }
  })
  return deferred.promise
}

/**
 * Parses a site, the applys a filter to the results, then saves the results.
 * Will make a file if it does not already exist.
 * @param  {String}   filename Filename of new site relative to directory.
 * @param  {Function} filter   Filter function. Gets the parsed output as an
 *                             argument. Must return Block.
 * @return {Promise}           On fail will return an error.
 */
manager.prototype.editSite = function(filename, filter) {
  var deferred = q.defer()
  var _this = this
  var filepath = path.normalize(path.join(this.config.sitePath, filename))

  this.parseSite(filename)
    .then(
      function(conf) {
        var expected = filter(conf)
        return fsp.writeFile(filepath, expected.toString(), 'utf8')
      },
      function() {
        var conf = parser.parse('')
        var expected = filter(conf)
        return fsp.writeFile(filepath, expected.toString(), 'utf8')
      }
    )
    .then(function(data) {
      if (_this.config.symlinkPath) {
        var sym = path.normalize(path.join(_this.config.symlinkPath, filename))
        return fsp.symlink(filepath, sym).then(
          function() {
            deferred.resolve()
          },
          function(e) {
            deferred.resolve()
          }
        )
      } else {
        deferred.resolve()
      }
    })
    .fail(function(err) {
      deferred.reject(err)
    })
  return deferred.promise
}
