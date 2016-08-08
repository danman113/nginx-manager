## Classes

<dl>
<dt><a href="#Block">Block</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#parse">parse(str)</a> ⇒ <code><a href="#Block">Block</a></code></dt>
<dd><p>Parses Nginx Conf string and turns it into a chain of blocks.</p>
</dd>
</dl>

<a name="Block"></a>

## Block
**Kind**: global class  

* [Block](#Block)
    * [new Block(parent, start, token)](#new_Block_new)
    * [.addStatement(statement, values)](#Block+addStatement)
    * [.parent()](#Block+parent) ⇒ <code>[Block](#Block)</code>
    * [.addBlock(token)](#Block+addBlock)
    * [.toString(depth, delimiter)](#Block+toString) ⇒ <code>String</code>

<a name="new_Block_new"></a>

### new Block(parent, start, token)
Block datatype. Has block information as wellas methods to dynamically add to it.Get output by running toString().


| Param | Type | Description |
| --- | --- | --- |
| parent | <code>[Block](#Block)</code> | Parent Block |
| start | <code>Number</code> | Start block of string. Unneeded. |
| token | <code>String</code> | Token to describe block. |

<a name="Block+addStatement"></a>

### block.addStatement(statement, values)
Adds a statement to current block.

**Kind**: instance method of <code>[Block](#Block)</code>  

| Param | Type | Description |
| --- | --- | --- |
| statement | <code>String</code> | Token for statement. |
| values | <code>Mixed</code> | Array of values for statement, or a continuing list. |

<a name="Block+parent"></a>

### block.parent() ⇒ <code>[Block](#Block)</code>
Returns parent of current block. Otherwise returns itself.

**Kind**: instance method of <code>[Block](#Block)</code>  
**Returns**: <code>[Block](#Block)</code> - Parent of current block, or current block.  
<a name="Block+addBlock"></a>

### block.addBlock(token)
Adds a child Block to the current Block.

**Kind**: instance method of <code>[Block](#Block)</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>[Block](#Block)</code> | Token for new Block. |

<a name="Block+toString"></a>

### block.toString(depth, delimiter) ⇒ <code>String</code>
Returns a string of a valid Nginx Config.

**Kind**: instance method of <code>[Block](#Block)</code>  
**Returns**: <code>String</code> - Valid Nginx Config String.  

| Param | Type | Description |
| --- | --- | --- |
| depth | <code>Number</code> | What the current depth is. Defaults to 0. |
| delimiter | <code>String</code> | What it uses to pad each block. |

<a name="parse"></a>

## parse(str) ⇒ <code>[Block](#Block)</code>
Parses Nginx Conf string and turns it into a chain of blocks.

**Kind**: global function  
**Returns**: <code>[Block](#Block)</code> - A Block.  
**Throws**:

- <code>Error</code> Will throw an error if the string is an        				  invalid Nginx Conf.


| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | Nginx Conf string. |

