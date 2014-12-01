Tag attribute reference
=======================

Attributes can be written using dashes or camelCase.


nu-doctype
---------

Tag will be preceed with a HTML5 doctype if it has this attribute

```html
<html nu-doctype></html>
```

results in:

```html
<!DOCTYPE html>
<html></html>
```


nu-scope
--------



nuModel
--------

nu-pipe
------

ni-if
----

Inserts the element when the value evaluates to true.

```html
<span nu-if="editable">This is editable</span>
````


nu-unless
--------

Inserts the element when the value evaluates to false.

```html
<span nu-unless="editable">This is not editable</span>
````


nu-key
-----



nu-checked
---------

Checks the input when the value evaluates to true.

Use this instead of value when binding to checkboxes or radio buttons.

```html
<input type="checkbox" nu-checked="checked">
````


nu-block
--------

Set this tag as a block with value as keyname when its parent template is declared as layout

```html
<html>
	<head nu-block="blockHead"></head>
	<body>
		...
	</body>
</html>
```


nu-[attribute]
--------------

Sets the value of an [attribute].

```html
<span nu-id="identif">hello</span>
```


nud-[attribute]
---------------

nux-[attribute]
---------------

**Layouts**

nu-layout
--------

nu-block
-------
