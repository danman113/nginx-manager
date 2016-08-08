module.exports = {};
module.exports.parse = parse;
module.exports.newBlock = function( ) { return parse( '' ); };

//Fix if statement positions

function endScope( localScope, str, offset ) {

	// Creates string attribute, then purges all local blocks.
	if ( offset === undefined ) offset = 1;
	localScope.string = str.substr(
		localScope.start + offset,
		localScope.end - localScope.start - 1
	);
	localScope.token = str.substr(
		localScope.scopeStart,
		localScope.start - localScope.scopeStart
	).trim();
	var children = localScope.children;
	for ( var x = children.length - 1; x >= 0; x -- ) {

		localScope.string =
		localScope.string.substr( 0, children[ x ].scopeStart - localScope.start + 1 ) +
		localScope.string.substr( children[ x ].end - localScope.start + 1, localScope.string.length );

	}

	parseStatements( localScope );

}

function parseStatements( localScope ) {

	localScope.statements = [];
	var string = localScope.string.substr( 0, localScope.string.length );
	var valid = true;
	var lastComment = string.length - 1;

	// Gets rid of all comments. Iterates through it backwards, keeping track
	// of the last newline, and deletes up to that point when it finds a comment.
	for ( var i = string.length - 1; i >= 0; i -- ) {

		if ( string[ i ] == '\n' ) {

			lastComment	= i;

		} else if ( string[ i ] == '#' ) {

			string = string.substr( 0, i ) + string.substr( lastComment, string.length );

		}

	}

	var lastDelimiter = 0;

	// Iterates through string, grabbing everything after the last delimiter,
	// and then parsing the contents into a statement.
	for ( var i = 0; i < string.length; i ++ ) {

		if ( string[ i ] == ';' ) {

			var statement = string.substr( lastDelimiter, i - lastDelimiter ).trim();
			lastDelimiter = i + 1;
			var spaceIndex = statement.indexOf( ' ' );
			if ( spaceIndex >= 0 ) {

				localScope.statements.push(
					{
						token: statement.substr( 0, spaceIndex ).trim(),
						values: statement.substr( spaceIndex + 1, statement.length ).trim().split( ' ' )
					}
				);

			}

		}

	}

	if ( ! localScope.debug ) {

		delete localScope.string;

	}


}

/**
 * Parses Nginx Conf string and turns it into a chain of blocks.
 * @param  {String} str Nginx Conf string.
 * @throws {Error}      Will throw an error if the string is an
 *         				  invalid Nginx Conf.
 * @return {Block}      A Block.
 */
function parse( str ) {

	// Base Empty Start Block.
	var scope = new Block( null, 0 );
	var localScope = scope;
	var lastDelimiter = 0;
	for ( var i = 0; i < str.length; i ++ ) {

		// Adds a child Block when it encounters a {.
		// Makes said child scope the local scope.
		// Uses lastDelimiter to find the token.
		if ( str[ i ] == '{' ) {

			var childScope = new Block( localScope, i );
			childScope.start = i;
			childScope.scopeStart = lastDelimiter;
			localScope.children.push( childScope );
			localScope = childScope;

		// Ends the current scope.
		// Also counts as a delimiter.
		} else if ( str[ i ] == '}' ) {

			lastDelimiter = i + 1;
			localScope.end = i;

			endScope( localScope, str, 1 );

			localScope = localScope.parent;

		} else if ( str[ i ] == ';' ) {

			lastDelimiter = i + 1;

		}

	}

	// Ends the global scope.
	lastDelimiter = i + 1;
	localScope.end = i;

	endScope( localScope, str, 0 );

	// If the final scope is not the current scope,
	// There's an error.
	if ( localScope.parent !== null )
		throw new Error( "No Valid Closing Brace." );

	return scope;

}

/**
 * Block datatype. Has block information as well
 * as methods to dynamically add to it.
 * Get output by running toString().
 * @class
 * @param {Block}   parent Parent Block
 * @param {Number}  start  Start block of string. Unneeded.
 * @param {String}  token  Token to describe block.
 */
function Block( parent, start, token ) {

	this.children = [];
	this.statements = [];
	this.start = start;
	this.parent = parent;
	this.token = token ? token : '';

}


/**
 * Adds a statement to current block.
 * @param {String} statement Token for statement.
 * @param {Mixed} values  Array of values for statement, or a continuing
 * list.
 * @return {Block} Current block.
 */
Block.prototype.addStatement = function( statement, values ) {

	// Checks that values is list. Otherwise makes one out of arguments.
	if ( arguments.length > 1 && typeof values != 'object' ) {

		values = [ values ];
		for ( var i = 2; i < arguments.length; i ++ ) {

			values.push( arguments[ i ] );

		}

	}

	this.statements.push( { token: statement, values: values } );
	return this;

};

/**
 * Returns parent of current block. Otherwise returns itself.
 * @return {Block} Parent of current block, or current block.
 */
Block.prototype.parent = function( ) {

	if( this.parent !== null)
		return this.parent;
	return this;

};

/**
 * Adds a child Block to the current Block.
 * @param {Block} token Token for new Block.
 * @return {Block} New block.
 */
Block.prototype.addBlock = function( token ) {

	var newScope = new Block( this, null, token );
	this.children.push( newScope );
	return newScope;

};

/**
 * Returns a string of a valid Nginx Config.
 * @param  {Number} depth     What the current depth is. Defaults to 0.
 * @param  {String} delimiter What it uses to pad each block.
 * @return {String}           Valid Nginx Config String.
 */
Block.prototype.toString = function( depth, delimiter ) {

	// Setting default options
	if ( isNaN( + depth ) ) depth = 0;
	if ( delimiter === undefined ) delimiter = '\t';

	var str = "";
	// Default nested depth is one deeper, unless there is no token.
	var nestedDepth = depth + 1;

	if ( this.token === '' ) {

		nestedDepth = depth;

	} else {

		for ( var i = depth - 1; i >= 0; i -- ) {

			str += delimiter;

		}
		str += this.token + ' {\n';

	}

	// Adds each statement in order.
	for ( var x = 0; x < this.statements.length; x ++ ) {

		for ( var y = nestedDepth - 1; y >= 0; y -- ) {

			str += delimiter;

		}
		str += this.statements[ x ].token + ' ' + this.statements[ x ].values.join( ' ' ) + ';\n';

	}

	// Recursively adds child blocks.
	for ( var i = 0; i < this.children.length; i ++ ) {

		str += this.children[ i ].toString( nestedDepth, delimiter );

	}

	// Adds closing brace if the token is valid.
	if ( this.token !== '' ) {

		for ( var i = depth - 1; i >= 0; i -- ) {

			str += delimiter;

		}
		str += '}\n';

	}
	return str;

};
