var _export = {
  parse: parse,
  newBlock: function() {
    return parse('')
  },
  Block: Block
}

module.exports = _export

var Block = require('./block.js')

//Fix if statement positions

function endScope(localScope, str, offset) {
  // Creates string attribute, then purges all local blocks.
  if (offset === undefined) offset = 1
  localScope.string = str.substr(localScope.start + offset, localScope.end - localScope.start - 1)
  localScope.token = str
    .substr(localScope.scopeStart, localScope.start - localScope.scopeStart)
    .trim()
  var children = localScope.children
  for (var x = children.length - 1; x >= 0; x--) {
    localScope.string =
      localScope.string.substr(0, children[x].scopeStart - localScope.start + 1) +
      localScope.string.substr(children[x].end - localScope.start + 1, localScope.string.length)
  }

  parseStatements(localScope)
}

function parseStatements(localScope) {
  localScope.statements = []
  var string = localScope.string.substr(0, localScope.string.length)
  var valid = true
  var lastComment = string.length - 1

  // Gets rid of all comments. Iterates through it backwards, keeping track
  // of the last newline, and deletes up to that point when it finds a comment.
  for (var i = string.length - 1; i >= 0; i--) {
    if (string[i] == '\n') {
      lastComment = i
    } else if (string[i] == '#') {
      string = string.substr(0, i) + string.substr(lastComment, string.length)
    }
  }

  var lastDelimiter = 0

  // Iterates through string, grabbing everything after the last delimiter,
  // and then parsing the contents into a statement.
  for (var i = 0; i < string.length; i++) {
    if (string[i] == ';') {
      var statement = string.substr(lastDelimiter, i - lastDelimiter).trim()
      lastDelimiter = i + 1
      var spaceIndex = statement.indexOf(' ')
      if (spaceIndex >= 0) {
        localScope.addStatement(
          statement.substr(0, spaceIndex).trim(),
          statement
            .substr(spaceIndex + 1, statement.length)
            .trim()
            .split(' ')
        )
      }
    }
  }

  if (!localScope.debug) {
    delete localScope.string
  }
}

/**
 * Parses Nginx Conf string and turns it into a chain of blocks.
 * @param  {String} str Nginx Conf string.
 * @throws {Error}      Will throw an error if the string is an
 *         				  invalid Nginx Conf.
 * @return {Block}      A Block.
 */
function parse(str) {
  // Base Empty Start Block.
  var scope = new Block(null, 0)
  var localScope = scope
  var lastDelimiter = 0
  for (var i = 0; i < str.length; i++) {
    // Adds a child Block when it encounters a {.
    // Makes said child scope the local scope.
    // Uses lastDelimiter to find the token.
    if (str[i] == '{') {
      var childScope = new Block(localScope, i)
      childScope.start = i
      childScope.scopeStart = lastDelimiter
      localScope.children.push(childScope)
      localScope = childScope

      // Ends the current scope.
      // Also counts as a delimiter.
    } else if (str[i] == '}') {
      lastDelimiter = i + 1
      localScope.end = i

      endScope(localScope, str, 1)

      localScope = localScope.parent
    } else if (str[i] == ';') {
      lastDelimiter = i + 1
    }
  }

  // Ends the global scope.
  lastDelimiter = i + 1
  localScope.end = i

  endScope(localScope, str, 0)

  // If the final scope is not the current scope,
  // There's an error.
  if (localScope.parent !== null) throw new Error('No Valid Closing Brace.')

  return scope
}
