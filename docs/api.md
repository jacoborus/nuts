API
===

nuts.addTemplate
----------------

Add a template and generate its model

Params:

- **`source`** *String*: html template
- **`callback`** *Function*: Signature: error, addedTemplate


nuts.addFile
------------

Add a template from file

Params:

- **`route`** *String*: template path
- **`callback`** *Function*: Signature: error, addedTemplate



nuts.addFolder
--------------

Add all templates in a folder using its filenames as template keynames

Params:

- **`folderPath`** *String*: route to folder
- **`callback`** *Function*: Signature: error



nuts.getTemplate
----------------

Get a template object from nuts templates archive

Params:

- **`name`** *String*: template keyname

**Return** *Object*: template object

