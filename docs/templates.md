# Templates

The template describes the view of the nut component. They are written in a
superset of HTML, inside a `<template>` tag on the root of the file:

```
<template>
  <h1>Hi there!</h1>
</template>
```

## Interpolations

Transfer data from the script to a text node:

- Ex: `<p>Hello { place.name }</p>`

Transfer data from the script to an attribute value:

- Ex: `<span :id="user.id">...`

## Directives

Directives add logic to the template, they are attributes wrapped by parens `()`

### Conditionals

Conditionally render parts of the view.

```html
<h2 (if)="book">{ book.title }</h2>
<p (elseif)="notes">{ notes }</p>
<span (else)>Info not found</span>
```

### Loops

Iterate through lists using `(loop)` attribute. Format of the value:
`loopTarget as name, index, position`. The last two are optionals:
`loopTarget as name, , pos`.

```html
<li (loop)="books as book, ,pos">{ pos }: { book.title }</li>
```

## Core tags (TODO)

### slot

Render a view passed from parent component

### macro

Syntactic sugar to write sub-components inside the component. Macros share the
script with the main template.

### await

Await blocks allow you to branch on the three possible states of a Promise —
pending, fulfilled or rejected. In SSR mode, only the pending state will be
rendered on the server.

### transition

Like vuejs ones
