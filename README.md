NUTS
====

**WORK IN PROGRESS**

New unique templates system

[![Build Status](https://travis-ci.org/jacoborus/nuts.svg?branch=master)](https://travis-ci.org/jacoborus/nuts)

- [Installation](#installation)
- [Example](#example)
- [Tag reference](#tag-reference)
    - [Asignation](#asignation)
        - [nut](#nut)
    - [Scopes](#scopes)
        - [model](#model)
        - [scope](#scope)
        - [inherit](#inherit)
    - [Conditionals](#conditionals)
        - [if](#if)
        - [unless](#unless)
    - [Iterations](#iterations)
        - [repeat](#repeat)
        - [each](#each)
    - [Attributes](#attributes)
        - [attribute](#attribute)
        - [class](#class)
        - [data-attribute](#data-attribute)
        - [boolean attributes](#boolean-attributes)
    - [Doctypes](#doctypes)
    - [Layouts](#layouts)
        - [Block](#block)
        - [layout](#layout)
- **API** (coming soon)



<a name="installation"></a>
Installation
------------

```
npm install nuts
```


<a name="example"></a>
Example
-------

`templates.html`:

```html
<section id="blog" nut="blog">
	<h1 nu-model="title"></h1>
	<article nu-as="blogPost" nu-repeat="articles"></article>
</body>


<article nut="blogPost">
	<h1 nu-model="title"></h1>
	<ul nu-each="related">
		<li nu-model></li>
	</ul>
</article>
```

myfile.js

```js
var nuts = require( 'nuts' );

var data = {
	title: 'Frontier Psychiatrist',
	articles: [{
		title: 'You are a nut',
		related: ['nuts', 'crazy']
	},{
		title: 'That boy needs therapy',
		related: ['psychosomatic', 'hypnotized']
	}]
};

nuts
.addFile( 'templates.html' )
.exec( function (err) {
	if (err) { throw err;}

	var rendered = nuts.render( 'blog', data );
	console.log( rendered );
});
```

results in:

```html
<section id="blog">
    <h1>Frontier Psychiatrist</h1>
    <article>
        <h1>You are a nut</h1>
        <ul>
            <li>nuts</li>
            <li>crazy</li>
        </ul>
    </article>
    <article>
        <h1>That boy needs therapy</h1>
        <ul>
            <li>psychosomatic</li>
            <li>hypnotized</li>
        </ul>
    </article>
</section>
```


<a name="tag-reference"></a>
Tag reference
-------------


* **Negations are not inplemented yet**


<a name="asignation"></a>
### Asignation

<a name="nut"></a>
#### `nut`

`nut` property identify tags as **`nut`** templates

```html
<span nut="superSpan">you are a nut!</span>
```

```js
nuts.render( 'superSpan' );
// => '<span>you are a nut!</span>'
```



<a name="scopes"></a>
### Scopes

<a name="model"></a>
#### `nu-model`

Specify tag content from scope property with `nu-model` keyname. Default tag content will be printed if there is no data in the model.

**Example:**

```html
<span nut="modelExample" nu-model="words">mustaches are for hipsters</span>
```

**With** data:

```js
nuts.render( "modelExample", { words: "nuts don't use mustaches" });
// => '<span>nuts don't use mustaches</span>'
```

**Without** data:

```js
nuts.render( "modelExample" );
// => '<span>mustaches are for hipsters</span>'
```


<a name="scope"></a>
#### `nu-scope`

Specify tag scope

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
		entry: 'A man with a golden eyeball and tighten your buttocks.'
	}
});
```

results in:

```html
<section nut="news">
	<p>Sometimes a parrot talks.</p>
	<article>
		<h1>Some birds are funny when they talk</h1>
		<p>A man with a golden eyeball and tighten your buttocks.</p>
	</article>
</section>
```


<a name="inherit"></a>
#### `nu-inherit`

Extend scope with selected or all properties from parent scope.

**Example:**

Having this model:

```js
nuts.render( 'inheritExample', {
	fruit:{
		name: 'Walnut',
		provider: 'tree',
		specs: {
			model: 'nut'
		}
	}
});
```

**Without** selecting any property

```html
<article nu-scope="fruit" nut="inheritExample">
	<h1 nu-model="name"></h1>
	<div nu-scope="specs" nu-inherit>
		<span nu-model="provider"></span>
		<span nu-model="model"></span>
		<span nu-model="name"></span>
	</div>
</article>
```

results in:

```html
<article>
	<h1>Walnut</h1>
	<div>
		<span>tree</span>
		<span>nut</span>
		<span>Walnut</span>
	</div>
</article>
```

**Selecting** properties

```html
<article nu-scope="fruit" nut="inheritExample">
	<h1 nu-model="name"></h1>
	<div nu-scope="specs" nu-inherit="name">
		<span nu-model="provider"></span>
		<span nu-model="model"></span>
		<span nu-model="name"></span>
	</div>
</article>
```

results in:

```html
<article>
	<h1>Walnut</h1>
	<div>
		<span>tree</span>
		<span></span>
		<span>Walnut</span>
	</div>
</article>
```


<a name="conditionals"></a>
### Conditionals

<a name="if"></a>
#### `nu-if`

Prints the element when the value evaluates to true.

**Example:**

```html
<span nu-if="season" nut="ifDemo">Get nuts!</span>
```

```js
nuts.render( 'ifDemo', { season: true });
// => '<span>Get nuts!</span>'
```

```js
nuts.render( 'ifDemo', { season: false });
// => ''
```

<a name="unless"></a>
#### `nu-unless`

**Currently Not Available**

Prints the element when the value evaluates to false.

**Example:**

```html
<span nu-unless="editable" nut="unlessDemo">This is not editable</span>
```

```js
nuts.render( 'unlessDemo', { editable: false });
// => '<span>Get nuts!</span>'
```

```js
nuts.render( 'unlessDemo', { editable: true });
// => ''
```


<a name="iterations"></a>
### Iterations

<a name="repeat"></a>
#### `nu-repeat`

Print the tag once per item in its scope. Works with objects and arrays

**Example**

```html
<ul nut="arrLoop" nu-scope="nums">
	<li nu-repeat nu-model></li>
</ul>
```

```js
nuts.render( 'arrLoop', { nums: [ 1, 2, 3 ]});
// => '<ul><li>1</li><li>2</li><li>3</li></ul>'
```


<a name="each"></a>
#### `nu-each`

Print the tag content once per item in its scope. Works with objects and arrays

**Example**

```html
<ul nut="arrLoop" nu-scope="nums" nu-each>
	<li nu-model></li>
</ul>
```

```js
nuts.render( 'arrLoop', { nums: [ 1, 2, 3 ]});
// => '<ul><li>1</li><li>2</li><li>3</li></ul>'
```


<a name="attributes"></a>
### Attributes


<a name="attribute"></a>
#### `nu-[attribute]`

Sets the value of an [attribute] as nu-[attribute] model.

**Example:**

```html
<span nu-id="identif" nut="demoAtt"></span>
```

```js
nuts.render( 'demoAtt', { identif: 'veryNuts' });
// => '<span id="veryNuts"></span>'
```

<a name="class"></a>
#### `nu-class`

Add classes from model to classlit

**Example**

```html
<span class="featured" nu-class="classes" nut="klass" ></span>
```

```js
nuts.render( 'klass', { classes: [ 'big', 'colored' ]});
// => '<span class="featured big colored"></span>'
```


<a name="data-attribute"></a>
#### `nud-[attribute]`

Sets the value of an data-[attribute] as nud-[attribute] model.

**Example**

```html
<span nud-language="identif" nut="demoD"></span>
```

```js
nuts.render( 'demoD', { identif: 'veryNuts' });
// => '<span data-language="veryNuts"></span>'
```


<a name="boolean-attributes"></a>
#### `nu-[attribute]-` (boolean attributes)

Prints [attribute] when its value evaluates to true. Just put two hyphens ("--") if your attribute name ends with a hyphen

**Example:**

```html
<input nut="readonlyDemo" nu-readonly-="available" type="text" name="walnuts">
```

```js
nuts.render( 'readonlyDemo', { available: true });
// => '<input readonly type="text" name="walnuts">'
```





<a name="doctypes"></a>
### Doctypes

<a name="doc-type-x"></a>
#### `nu-doctype-[x]`

Tag will be preceed with a HTML doctype if it has this attribute

**Example:**

```html
<html nu-doctype nut="htmlBase"></html>
```

```js
nuts.render( 'htmlBase' );
// => '<!DOCTYPE html><html></html>'
```

**Types:**

<a name="doctype-5"></a>
##### `nu-doctype` or `nu-doctype-5` - HTML5

```html
<!DOCTYPE html>
```

<a name="doctype-4"></a>
##### `nu-doctype-4` or `nu-doctype-4s` - HTML 4.01 Strict

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

<a name="doctype-4t"></a>
##### `nu-doctype-4t` - HTML 4.01 Transitional

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

<a name="doctype-4f"></a>
##### `nu-doctype-4f` - HTML 4.01 Frameset

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

<a name="doctype-x"></a>
##### `nu-doctype-x` or `nu-doctype-xs` - XHTML 1.0 Strict

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

<a name="doctype-xt"></a>
##### `nu-doctype-xt` - XHTML 1.0 Transitional

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

<a name="doctype-xf"></a>
##### `nu-doctype-xf` - XHTML 1.0 Frameset

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

<a name="doctype-11"></a>
##### `nu-doctype-11` - XHTML 1.1

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```





<a name="layouts"></a>
### Layouts


<a name="block"></a>
#### nu-block

Set this tag as a block named as `nu-block` value when its parent template is declared as layout

**Example:**

```html
<html>
	<head nu-block="blockHead"></head>
	<body>
		...
	</body>
</html>
```

<a name="layout"></a>
#### nu-layout

Coming soon




[API](https://github.com/jacoborus/nuts/blob/master/docs/api.md)
-----

See [API docs](https://github.com/jacoborus/nuts/blob/master/docs/api.md).

.
<br><br>
---

© 2015 Jacobo Tabernero - [jacoborus](http://jacoborus.codes)

Released under [MIT License](https://raw.github.com/jacoborus/nuts/master/LICENSE)
