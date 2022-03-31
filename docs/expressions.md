# Expressions

Nuts uses expressions to pass data to the templates.
Expressions can be found in 3 places:

- As interpolation in text nodes. Wrapped between curly braces `{}`
  - Ex: `<p>Hello { place.name }</p>`
- As value of a dynamic attribute of a tag or component. Their attribute name will be prepended by `@`, `$`, `:`, or `::`
  - Ex: `<my-component :id="user.id" />`
- As attribute name of a directive tag. Prepended by `@`
  - Ex: `<loop @users.active="user">...</loop>`

## Format

Values from the scope have no prefix:

```
user.name.first
users.1.name
```

Accept subexpressions wrapped by brackets

```
users.[client.id].name
```

Values returned from the setup function need the `@` prefix, they can be invoked
with parens (like in js), and accept arguments separated by commas

```
@capitalize(user.name.first)
@actions.start(game.map, user.id)
```

Values returned from the app context need the `$` prefix, they can be invoked with
parens (like in js), and accept arguments separated by commas

```
$router.push(user.id)
$route.params.name
```
