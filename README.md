NUTS
====

New unique templates system

**IN EARLY DEVELOPMENT**

[![Build Status](https://travis-ci.org/jacoborus/nuts.svg?branch=master)](https://travis-ci.org/jacoborus/nuts)

Installation
------------

```
npm install nuts
```



Tag attribute reference
-----------------------

Previous notes:

- Attributes can be written using dashes or camelCase. (`nu-doctype` equals `nuDoctype`)


### nut


Set template name as nut value

```html
<span nut="superSpan">you are a nut!</span>
```

```js
nuts.render( 'superSpan' );
```

results in:

```html
<span>you are a nut!</span>
```


### nu-doctype


Tag will be preceed with a HTML5 doctype if it has this attribute


Example:

```html
<html nu-doctype nut="htmlBase"></html>
```

```js
nuts.render( 'htmlBase' );
```

results in:

```html
<!DOCTYPE html>
<html></html>
```



### nu-model


Specify tag content from scope property with `nu-model` keyname. Default tag content will be printed if there is no data in the model.

**Example**

```html
<span nut="modelExample" nu-model="words">mustaches are for hipsters</span>
```

With data:

```js
nuts.render( "modelExample", {words: "nuts don't use mustaches"} );
```

results in:

```html
<span>nuts don't use mustaches</span>
```

Without data:

```js
nuts.render( "modelExample" );
```

results in:

```html
<span>mustaches are for hipsters</span>
```



### nu-scope


Specify tag scope from parent scope


**Example**

```html
<section nut="news">
	<p nu-model="intro"></p>
	<article nu-scope="article">
		<h1 nu-model="title"></h1>
		<p nu-model="entry"></p>
	</article>
</section>
```

```js
nuts.render( 'news', {
	intro: 'Sometimes a parrot talks.',
	article: {
		title: 'Some birds are funny when they talk',
		entry: 'And milk, and rectangles, to an optometrist, a man with a golden eyeball and tighten your buttocks.'
	}
});
```

results in:

```html
<section nut="news">
	<p>Sometimes a parrot talks.</p>
	<article>
		<h1>Some birds are funny when they talk</h1>
		<p>And milk, and rectangles, to an optometrist, a man with a golden eyeball and tighten your buttocks.</p>
	</article>
</section>
```




### nu-pipe


### nu-if


Inserts the element when the value evaluates to true.

```html
<span nu-if="editable">This is editable</span>
```


### nu-unless


Inserts the element when the value evaluates to false.

```html
<span nu-unless="editable">This is not editable</span>
```


### nu-key




### nu-checked


Checks the input when the value evaluates to true.

Use this instead of value when binding to checkboxes or radio buttons.

```html
<input type="checkbox" nu-checked="checked">
```


### nu-block


Set this tag as a block with value as keyname when its parent template is declared as layout

```html
<html>
	<head nu-block="blockHead"></head>
	<body>
		...
	</body>
</html>
```


### nu-[attribute]


Sets the value of an [attribute].

```html
<span nu-id="identif">hello</span>
```


### nud-[attribute]


### nux-[attribute]


**Layouts**

### nu-layout

### nu-block




API
---

### nuts.addTemplate

Add a template and generate its model

Params:

- **`name`** *String*: template keyname
- **`source`** *String*: html template
- **`callback`** *Function*: Signature: error, addedTemplate


### nuts.addFile

Add a template from file

Params:

- **`name`** *String*: template keyname
- **`route`** *String*: template path
- **`callback`** *Function*: Signature: error, addedTemplate



### nuts.addFolder

Add all templates in a folder using its filenames as template keynames

Params:

- **`folderPath`** *String*: route to folder
- **`callback`** *Function*: Signature: error



### nuts.getTemplate

Get a template object from nuts templates archive

Params:

- **`name`** *String*: template keyname

**Return** *Object*: template object


<br><br>
<iframe width="720" height="480" src="//www.youtube.com/embed/qLrnkK2YEcE" frameborder="0" allowfullscreen></iframe><br><small>Video 'Frontier Psychiatrist' is property of The Avalanches</small>


---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/nuts/master/LICENSE)
