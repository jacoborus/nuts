NUTS
====

New unique templates system

**IN EARLY DEVELOPMENT**

Installation
------------

```
npm install nuts
```


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

---

© 2014 Jacobo Tabernero - [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/nuts/master/LICENSE)
