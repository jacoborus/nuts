API
===

addTemplate
-----------

Add a template and generate its model

**Params:**

- **`source`** *String*: html template
- **`callback`** *Function*: Signature: error, addedTemplate


**Example:**

```js
nuts.addTemplate( '<span nut="devs"></span>', function (err, tmpl) {
	if (err) { throw err; }
	console.log( tmpl.src );
	// => '<span nut="devs"></span>'
});



addFile
-------

Add one or multiple templates from file

**Params:**

- **`route`** *String*: template path
- **`callback`** *Function*: Signature: error, addedTemplate

**Example:**

hi.html
```html
<span nut="hello">Hello nuts!</span>
<span nut="bye">Godd bye nuts!</span>
```

```js
nuts.addFile( 'hi.html', function (err, tmpls) {
	if (err) { throw err; }
	console.log( tmpls.hello.src );
	// => '<span nut="hello">Hello nuts!</span>'
});



addFolder
---------

Add all templates in a folder using its filenames as template keynames

**Params:**

- **`folderPath`** *String*: route to folder
- **`callback`** *Function*: Signature: error



getTemplate
-----------

Get a template object from nuts templates archive

**Params:**

- **`name`** *String*: template keyname

**Return** *Object*: template object


render
------



