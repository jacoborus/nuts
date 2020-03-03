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
  <h1>Hello World!</h1>
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
import * as view from './myview.nuts.js'

export const render = view.render(function (scope) {
  scope.myid = 'awesome'
  scope.count = 0
  scope.increment = () => ++scope.count
})
```

Render the component in your app:

```js
import { render } from './mycomponent.js'

render('#target')
```

Now your app should look like this:

```html
<div id="target">
  <h1>Hello World!</h1>
  <span id="awesome">Count: 0</span>
</div>
```

and count will increment 1 every second
