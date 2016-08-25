<a name="manager"></a>

## manager
**Kind**: global class  

* [manager](#manager)
    * [new manager(config)](#new_manager_new)
    * [.addSite(filename, conf)](#manager+addSite) ⇒ <code>Promise</code>
    * [.parseSite(filename)](#manager+parseSite) ⇒ <code>Promise</code>
    * [.reload()](#manager+reload) ⇒ <code>Promise</code>
    * [.editSite(filename, filter)](#manager+editSite) ⇒ <code>Promise</code>

<a name="new_manager_new"></a>

### new manager(config)
Main Manager class. Set a main directory and you can easily add and edit
sites in it.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Config file. Defaults: \n                         nginxPath: '/usr/sbin/nginx'                         sitePath: '/etc/nginx/sites-available/'                         symlinkPath: '/etc/nginx/sites-enabled/' |

<a name="manager+addSite"></a>

### manager.addSite(filename, conf) ⇒ <code>Promise</code>
Adds a site, throws an error if one already exists.

**Kind**: instance method of <code>[manager](#manager)</code>  
**Chainable**  
**Returns**: <code>Promise</code> - in fail will return an error.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>String</code> | Filename of new site relative to directory |
| conf | <code>Block</code> | Conf that will compose the site. |

<a name="manager+parseSite"></a>

### manager.parseSite(filename) ⇒ <code>Promise</code>
Parses a site.

**Kind**: instance method of <code>[manager](#manager)</code>  
**Chainable**  
**Returns**: <code>Promise</code> - On success will return a Block of the requested
                          site. On fail will return an error.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>String</code> | Filename of new site relative to directory. |

<a name="manager+reload"></a>

### manager.reload() ⇒ <code>Promise</code>
Will reload nginx gracefully using the supplied nginxPath. Use sparingly.

**Kind**: instance method of <code>[manager](#manager)</code>  
**Returns**: <code>Promise</code> - On success will return stdout and stderr of call. On fail
                     will return error.  
<a name="manager+editSite"></a>

### manager.editSite(filename, filter) ⇒ <code>Promise</code>
Parses a site, the applys a filter to the results, then saves the results.
Will make a file if it does not already exist.

**Kind**: instance method of <code>[manager](#manager)</code>  
**Returns**: <code>Promise</code> - On fail will return an error.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>String</code> | Filename of new site relative to directory. |
| filter | <code>function</code> | Filter function. Gets the parsed output as an                             argument. Must return Block. |

