NUTS
====

View compiler for web apps. Work in progress

## Install

```sh
npm i --save nuts
```

## Quick start

Describe your view (`myview.nuts.html`):

```html
<template>
  <span id="{ myid }">Count: {{: count }}</span>
  <button @click="increment">+1</button>
</template>
```

Compile it (will create `myview.nuts.js`):

```sh
$ npx nuts myview.nuts.html
```

Create your component controller `mycomponent.js`:

```js
// import view
import { createNut } from './myview.nuts.js'

export const render = createNut(function (box) {
  box.myid = 'awesome'
  box.count = 0
  box.increment = () => ++scope.count
})
```

Render the component in your app:

```js
import { render } from './mycomponent.js'

const { elem } = render({})
document.getElementById('target').appendChild(elem)
```

Now your app should look like this:

```html
<div id="target">
  <span id="awesome">Count: 0</span>
  <button>+1</button>
</div>
```

and count will increment 1 every click on button
