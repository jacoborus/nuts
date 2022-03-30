# Expressions

Nuts uses expressions to pass data to the templates.
Expressions can be interpolated in text or in tag attributes.

Use curly braces to interpolate an expression in a text node:

```html
<span>Hello { name }</span>
```

## Format

Values from the scope have no prefix:

```
user.name.first
users.1.name
{ users.[route.params.id].name }
```

Accept subexpressions wrapped by brackets

```
users.[route.params.id].name
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
