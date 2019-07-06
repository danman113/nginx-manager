module.exports = Statement

function Statement(token, values, parent) {
  this.token = token
  this.values = values
  this.parent = parent
}

Statement.prototype.getParent = function() {
  if (this.parent) return this.parent
}

Statement.prototype.find = function(token) {
  if (this.parent) return this.parent.find(token)
  return null
}

Statement.prototype.toString = function() {
  return this.token + ' ' + this.values.join(' ') + ';\n'
}
