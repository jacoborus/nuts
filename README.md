NUTS
====

New unique templates system

[![Build Status](https://travis-ci.org/jacoborus/nuts.svg?branch=master)](https://travis-ci.org/jacoborus/nuts)



Installation
------------

```
npm install nuts
```


Example
-------

`templates.html`:

```html
<html nut="blog" nu-doctype>
	<head>
		<title nu-model="title"></title>
	</head>
	<body nu-scope="blog">
		<h1 nu-model="title"></h1>
		<section>
			<article nu-as="blogPost" nu-repeat="articles"></article>
		</section>
	</body>
</html>

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
	title: 'Some birds are funny when they talk',
	blog: {
		title: 'Verses',
		articles: [{
			title: 'You are a nut',
			related: ['nuts', 'crazy']
		},{
			title: 'That boy needs therapy',
			related: ['psychosomatic', 'hypnotized']
		}]
	}
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
<!DOCTYPE html>
<html>

<head>
    <title>Some birds are funny when they talk</title>
</head>

<body>
    <h1>Verses</h1>
    <section>
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
</body>

</html>
```



[Reference](https://github.com/jacoborus/nuts/blob/master/docs/reference.md)
-----

See [reference docs](https://github.com/jacoborus/nuts/blob/master/docs/reference.md).


[API](https://github.com/jacoborus/nuts/blob/master/docs/api.md)
-----

See [API docs](https://github.com/jacoborus/nuts/blob/master/docs/api.md).


<br><br>
---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/nuts/master/LICENSE)
