Tag reference
=============

Previous notes:

- Attributes can be written using dashes or camelCase. (`nu-doctype` equals `nuDoctype`)


nut
---

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



nu-doctype
----------

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



nu-model
--------

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



nu-scope
--------

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



nu-pipe
-------

Extend scope with picked properties from parent scope. Scope will be extended with all parent properties if no properties are selected.

**Example:**

Having this model:

```js
nuts.render( 'directExtend', {
	person:{
		name: 'Walnut',
		provider: 'tree',
		specs: {
			model: 'nut'
		}
	}
});
```

Without picking properties

```html
<article nu-scope="fruit" nut="pipeEx">
	<h1 nu-model="name"></h1>
	<div nu-scope="specs" nu-pipe>
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

Picking properties

```html
<article nu-scope="fruit" nut="pipeEx">
	<h1 nu-model="name"></h1>
	<div nu-scope="specs" nu-pipe="name">
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



nu-if
-----

Inserts the element when the value evaluates to true.

**Example:**

```html
<span nu-if="editable" nut="ifDemo">This is editable</span>
```

```js
nuts.render( 'ifDemo', {editable: true});
// => '<span>This is editable</span>'
```

```js
nuts.render( 'ifDemo', {editable: false});
// => ''
```



nu-unless
---------

Inserts the element when the value evaluates to false.

```html
<span nu-unless="editable" nut="unlessDemo">This is not editable</span>
```

```js
nuts.render( 'unlessDemo', {editable: false});
// => '<span>This is editable</span>'
```

```js
nuts.render( 'unlessDemo', {editable: true});
// => ''
```



nu-repeat
---------

Print the tag once per item in its scope. Works with objects and arrays

**Example:**

```html
<ul nut="arrLoop" nu-scope="nums">
	<li nu-repeat nu-model></li>
</ul>
```

```js
nuts.render( 'arrLoop', { nums: [1,2,3]});
// => '<ul><li>1</li><li>2</li><li>3</li></ul>'
```



nu-each
-------

Print the tag content once per item in its scope. Works with objects and arrays

**Example:**

```html
<ul nut="arrLoop" nu-scope="nums" nu-each>
	<li nu-model></li>
</ul>
```

```js
nuts.render( 'arrLoop', { nums: [1,2,3]});
// => '<ul><li>1</li><li>2</li><li>3</li></ul>'
```



nu-key
------

`nu-key` works inside loops (`nu-repeat` and `nu-each`). Prints keyname of current iterated object

```html
<ul nut="loopKey">
	<li nu-repeat="nums">
		<span nu-key></span>
		<span nu-model></span>
	</li>
</ul>
```

```js
nuts.render( 'loopKey', {
	nums: {
		one: 'one1',
		two:'two2',
		three:'three3'
	}
});
```

results in:

```html
<ul>
	<li><span>one</span><span>one1</span></li>
	<li><span>two</span><span>two2</span></li>
	<li><span>three</span><span>three3</span></li>
</ul>
```



nu-checked
----------

Checks the input when the value evaluates to true.

Use this instead of value when binding to checkboxes or radio buttons.

```html
<input type="checkbox" nu-checked="available" nut="checkedDemo">
```

```js
nuts.render( 'checkedDemo', {available: true});
// => '<input type="checkbox" checked>'
```



nu-[attribute]
--------------

Sets the value of an [attribute] as nu-[attribute] model.

```html
<span nu-id="identif" nut="demoAtt">Developer</span>
```

```js
nuts.render( 'identif', {identif: 'veryNuts'});
```
results in:

```html
<span id="veryNuts">Developer</span>
```



nud-[attribute]
---------------

Sets the value of an data-[attribute] as nud-[attribute] model.

```html
<span nud-language="identif" nut="demoAtt">Developer</span>
```

```js
nuts.render( 'identif', {identif: 'veryNuts'});
```
results in:

```html
<span data-language="veryNuts">Developer</span>
```



nux-[attribute]
---------------

Sets the value of an x-[attribute] as nud-[attribute] model.

```html
<span nux-language="identif" nut="demoAtt">Developer</span>
```

```js
nuts.render( 'identif', {identif: 'veryNuts'});
```
results in:

```html
<span x-language="veryNuts">Developer</span>
```



Layouts reference
=================


nu-block
--------

Set this tag as a block named as `nu-block` value when its parent template is declared as layout

```html
<html>
	<head nu-block="blockHead"></head>
	<body>
		...
	</body>
</html>
```


nu-layout
---------

Coming soon


