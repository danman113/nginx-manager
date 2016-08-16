var Statement = require( './statement.js' );

module.exports = Block;

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

	this.statements.push( new Statement( statement, values, this ) );
	return this;

};

/**
 * Returns parent of current block. Otherwise returns itself.
 * @return {Block} Parent of current block, or current block.
 */
Block.prototype.getParent = function( ) {

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


Block.prototype.find = function( query ) {

    query = query.trim();
    for( var i = 0; i < this.statements.length; i++ ){

		var token = this.statements[ i ].token.trim();
        if( token == query ){

            return this.statements[ i ];

        }

    }
    
    for( var i = 0; i < this.children.length; i++ ){

        var token = this.children[ i ].token.trim();
        if ( token == query ) return this.children[ i ];
        var find = this.children[ i ].find( query );
        if ( find ) return find;

    }
    
    return null;

}

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
		str += this.statements[ x ].toString();

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
