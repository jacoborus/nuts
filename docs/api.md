api API
============


- [addTemplate](#addTemplate)
- [addFile](#addFile)
- [getTemplate](#getTemplate)
- [addFolder](#addFolder)
- [addTree](#addTree)
- [render](#render)
- [addFilters](#addFilters)

<a name="addTemplate"></a>
addTemplate( source )
------------------------------------------------------------

Add templates from given `string` to templates archive

**Parameters:**
- **source** *String*: html with nut templates
- **Return** *Object*: promise

Example:
```js
nuts.addTemplate(  '<span nut="super-span" nu-model="fruit"><span>' );
```

<a name="addFile"></a>
addFile( route )
------------------------------------------------------------

Add templates from html file

**Parameters:**
- **route** *String*: templates file path
- **Return** *Object*: promise

Example:
```js
nuts
.addFile( 'core-templates.html' )
.addFile( 'calendar-templates.html' );
// => return promise
```

<a name="getTemplate"></a>
getTemplate( name )
------------------------------------------------------------

Get a object template from templates archive

**Parameters:**
- **name** *String*: template keyname
- **Return** *Object*: template object

Example:
```js
nuts.getTemplate( 'super-span' );
```

<a name="addFolder"></a>
addFolder( folder )
------------------------------------------------------------

Add all templates from files within a folder

**Parameters:**
- **folder** *String*: path to folder
- **Return** *Object*: promise

Example:
```js
nuts.addFolder( './templates' );
```

<a name="addTree"></a>
addTree( folderPath )
------------------------------------------------------------

Add all templates in a folder using its filename paths as template keynames.
This operation only allow a template each file

**Parameters:**
- **folderPath** *String*: route to folder
- **Return** *Object*: promise

Example:
```js
nuts.addTree( './layouts' );
```

<a name="render"></a>
render( tmplName, data )
------------------------------------------------------------

Get a rendered template

**Parameters:**
- **tmplName** *String*: template keyname
- **data** *Object*: locals
- **Return** *String*: rendered html

Example:
```js
var tmpl = '<span nut="simpleTag">hola</span>',
var html;

nuts
.addTemplate( tmpl )
.exec( function (err) {
    html = nuts.render( 'simpleTag', {} );
    // html === '<span>hola</span>'
});
```

<a name="addFilters"></a>
addFilters( filters )
------------------------------------------------------------

Add filters to filters archive

**Parameters:**
- **filters** *Object*
- **Return** *Object*: promise

Example:
```js
nuts.addFilters({
  templatename: {
    fieldName: function (val, scope) {
      return 'get ' + val + '!';
    }
  }
});
```


