'use strict'

const childrenCounter = function (limit, callback) {
  let count = 0
  let res = []

  return function (text, i) {
    res[i] = text
    if (++count === limit) {
      callback(res.join(''))
    }
  }
}

const renderChildren = function (children, out, x, next, cb, pos) {
  let count = childrenCounter(children.length, text => {
    next.render(out + text, x, cb, pos)
  })
  children.forEach((child, i) => child.render(x, count, i))
}

const renderRepeat = function (render, out, x, cb, pos) {
  let count = childrenCounter(x.length, text => cb(out + text, pos))
  x.forEach((y, i) => render.render('', y, count, i))
}

const renders = {}

renders.inheritFull = function (out, x, cb, pos) {
  let pre = {}

  for (let i in x) {
    pre[i] = x[i]
  }

  if (x[this.scope]) {
    x = x[this.scope]
  } else {
    x = {}
  }

  for (let i in pre) {
    x[i] = pre[i]
  }

  this.next.render('', x, cb, pos)
}

renders.inheritPart = function (out, x, cb, pos) {
  let pre = {}
  let props = this.inherit.split(' ')

  for (let i in props) {
    pre[props[i]] = x[props[i]]
  }

  if (x[this.scope]) {
    x = x[this.scope]
  } else {
    x = {}
  }

  for (let i in pre) {
    x[i] = pre[i]
  }

  this.next.render('', x, cb, pos)
}

renders.scope = function (out, x, cb, pos) {
  this.next.render('', x[ this.scope ], cb, pos)
}

renders.filter = function (out, x, cb, pos) {
  let y = {}

  if (this.filter._global) {
    x = this.filter._global(x)
  }

  for (let i in x) {
    if (!this.filter[i]) {
      y[i] = x[i]
    } else {
      y[i] = this.filter[i](x[i], x)
    }
  }
  this.next.render('', y, cb, pos)
}

renders.repeatAll = function (out, x, cb, pos) {
  let y = x[ this.repeat ]
  renderRepeat(this.next, out, y, cb, pos)
}

renders.repeatPart = function (out, x, cb, pos) {
  renderRepeat(this.next, out, x, cb, pos)
}

renders.nuif = function (out, x, cb, pos) {
  if (x[ this.nuif ]) {
    this.next.render(out, x, cb, pos)
  } else {
    cb(out, pos)
  }
}

renders.doctype = function (out, x, cb, pos) {
  // add doctype to string
  this.next.render(this.out, x, cb, pos)
}

renders.noDoctype = function (out, x, cb, pos) {
  this.next.render(this.start, x, cb, pos)
}

renders.attribs = function (out, x, cb, pos) {
  for (let i in this.attribs) {
    out += ' ' + i + '="' + this.attribs[i] + '"'
  }
  this.next.render(out, x, cb, pos)
}

renders.nuAtts = function (out, x, cb, pos) {
  for (let i in this.nuAtts) {
    if (this.nuAtts[i] !== undefined) {
      out += ' ' + i + '="' + x[this.nuAtts[i]] + '"'
    }
  }
  this.next.render(out, x, cb, pos)
}

renders.nuClass = function (out, x, cb, pos) {
  let pre = ' class="'
  if (x[this.nuClass] !== undefined) {
    if (this.classes) {
      out += pre + this.classes + ' ' + x[this.nuClass] + '"'
    } else {
      out += pre + x[this.nuClass] + '"'
    }
  } else {
    if (this.classes) {
      out += pre + this.classes + '"'
    }
  }
  this.next.render(out, x, cb, pos)
}

renders.nuSakes = function (out, x, cb, pos) {
  for (let i in this.nuSakes) {
    if (x[this.nuSakes[i]] !== undefined) {
      out += ' ' + i + '="' + x[this.nuSakes[i]] + '"'
    } else {
      out += ' ' + i + '="' + this.namesakes[i] + '"'
    }
  }
  this.next.render(out, x, cb, pos)
}

renders.fullModelNoChildren = function (out, x, cb, pos) {
  if (typeof x !== 'undefined') {
    if (this.formatters) {
      x = this.formatters[0](x)
    }
    return this.next.render(out + x, x, cb, pos)
  }
  this.next.render(out, x, cb, pos)
}

renders.partModelNoChildren = function (out, x, cb, pos) {
  let y
  if (x[this.model] !== undefined) {
    if (this.formatters) {
      y = out + this.formatters[0](x[this.model])
    } else {
      y = out + x[ this.model ]
    }
    return this.next.render(y, x, cb, pos)
  }
  this.next.render(out, x, cb, pos)
}

renders.closeTag = function (out, x, cb, pos) {
  this.next.render(out + '>', x, cb, pos)
}

renders.NoModelChildren = function (out, x, cb, pos) {
  renderChildren(this.children, out, x, this.next, cb, pos)
}

renders.fullModelChildren = function (out, x, cb, pos) {
  if (typeof x !== 'undefined') {
    return this.next.render(out + x, x, cb, pos)
  }
  renderChildren(this.children, out, undefined, this.next, cb, pos)
}

renders.fullModelFormatChildren = function (out, x, cb, pos) {
  if (typeof x !== 'undefined') {
    return this.next.render(out + this.formatters[0](x), x, cb, pos)
  }
  renderChildren(this.children, out, undefined, this.next, cb, pos)
}

renders.partModelChildren = function (out, x, cb, pos) {
  if (x[this.model] !== undefined) {
    return this.next.render(out + x[ this.model ], x, cb, pos)
  }
  renderChildren(this.children, out, undefined, this.next, cb, pos)
}

renders.partModelFormatChildren = function (out, x, cb, pos) {
  if (x[this.model] !== undefined) {
    return this.next.render(out + this.formatters[0](x[ this.model ]), x, cb, pos)
  }
  renderChildren(this.children, out, undefined, this.next, cb, pos)
}

renders.fullModelFullEach = function (out, x, cb, pos) {
  if (typeof x !== 'undefined') {
    if (this.formatters) {
      return this.next.render(out + this.formatters[0](x), undefined, cb, pos)
    }
    return this.next.render(out + x, undefined, cb, pos)
  }
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(x.length, text => cb(out + text + tagEnd, pos))

  x.forEach((y, i) => {
    renderChildren(children, '', y, {
      render: text => count(text, i)
    },
    count, i)
  })
}

renders.partModelFullEach = function (out, x, cb, pos) {
  if (x[this.model] !== undefined) {
    if (this.formatters) {
      return this.next.render(out + this.formatters[0](x[ this.model ]), undefined, cb, pos)
    }
    return this.next.render(out + x[ this.model ], undefined, cb, pos)
  }
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(x.length, text => cb(out + text + tagEnd, pos))

  x.forEach((y, i) => {
    renderChildren(children, '', y, {
      render: text => count(text, i)
    },
    count, i)
  })
}

renders.fullModelPartialEach = function (out, x, cb, pos) {
  if (typeof x !== 'undefined') {
    if (this.formatters) {
      return this.next.render(out + this.formatters[0](x), x, cb, pos)
    }
    return this.next.render(out + x, x, cb, pos)
  }
  let y = x[this.each]

  if (!Array.isArray(y)) {
    return cb(out + this.tagEnd, pos)
  }
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(y.length, text => cb(out + text + tagEnd, pos))

  y.forEach((z, i) => {
    renderChildren(children, '', z, {
      render: text => count(text, i)
    },
    count, i)
  })
}

renders.partModelPartialEach = function (out, x, cb, pos) {
  if (x[this.model] !== undefined) {
    if (this.formatters) {
      return this.next.render(out + this.formatters[0](x[ this.model ]), x, cb, pos)
    }
    return this.next.render(out + x[ this.model ], x, cb, pos)
  }
  let y = x[this.each]

  if (!Array.isArray(y)) {
    return cb(out + this.tagEnd, pos)
  }
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(y.length, text => cb(out + text + tagEnd, pos))

  y.forEach((z, i) => {
    renderChildren(children, '', z, {
      render: text => count(text, i)
    },
    count, i)
  })
}

renders.NoModelFullEach = function (out, x, cb, pos) {
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(x.length, text => cb(out + text + tagEnd, pos))

  x.forEach((y, i) => {
    renderChildren(children, '', y, {
      render: text => count(text, i)
    },
    count, i)
  })
}

renders.NoModelPartialEach = function (out, x, cb, pos) {
  let y = x[this.each]

  if (!Array.isArray(y)) {
    return cb(out + this.tagEnd, pos)
  }
  let children = this.children
  let tagEnd = this.tagEnd
  let count = childrenCounter(y.length, text => cb(out + text + tagEnd, pos))

  y.forEach((z, i) => {
    renderChildren(children, '', z, {
      render: text => count(text, i)
    },
    count, i)
  })
}

module.exports = renders
