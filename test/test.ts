const arr = [
  require('./compiler/compile-text-test'),
  require('./compiler/compile-attribs-test'),
  require('./compiler/compile-tag-test'),
  require('./compiler/compile-template-test'),
  require('./builder/build-text-test'),
  require('./builder/build-attribs-test'),
  require('./builder/build-tag-test'),
  require('./builder/build-template-test')
]

console.log('test files:', arr.length)
