'use strict'

const doctypes = require('./doctypes.json'),
      renders = require('./renders.js')

const text = function (elData) {
  return function (x, callback, i) {
    callback(elData, i)
  }
}

const comment = function (elData) {
  let out = `<!--${elData}-->`
  return function (x, callback, i) {
    callback(out, i)
  }
}

const cdata = function (elData) {
  let out = `<!${elData}>`
  return function (x, callback, i) {
    callback(out, i)
  }
}

const directive = function (elData) {
  let out = `<!${elData}>`
  return function (x, callback, i) {
    callback(out, i)
  }
}

const getRenderLink = function (fn, next, props) {
  let r = {}

  for (let i in props) {
    r[i] = props[i]
  }
  r.render = fn
  r.next = next
  return r
}

const tag = function (precompiled, children, filters) {
  let tagEnd = '</' + precompiled.name + '>',
      render, rData

  if (precompiled.voidElement) {
    render = {
      render: function (out, x, cb, pos) {
        cb(out + '>', pos)
      }
    }
  } else {
    render = {
      render: function (out, x, cb, pos) {
        cb(out + tagEnd, pos)
      }
    }

    if (typeof precompiled.model !== 'undefined') {
      rData = {
        model: precompiled.model,
        children: children,
        formatters: precompiled.formats
      }
      if (!children) { // model, no children
        if (precompiled.model) {
          render = getRenderLink(renders.partModelNoChildren, render, rData)
        } else {
          render = getRenderLink(renders.fullModelNoChildren, render, rData)
        }
      } else { // model, children
        if (typeof precompiled.each !== 'undefined') { // model, children, each
          if (precompiled.each) {
            if (precompiled.model) {
              render = getRenderLink(renders.partModelPartialEach, render, rData)
            } else {
              render = getRenderLink(renders.fullModelPartialEach, render, rData)
            }
          } else {
            if (precompiled.model) {
              render = getRenderLink(renders.partModelFullEach, render, rData)
            } else {
              render = getRenderLink(renders.fullModelFullEach, render, rData)
            }
          }
        } else { // model, children, no each
          if (precompiled.model) { // partial model
            if (precompiled.formats) {
              render = getRenderLink(renders.partModelFormatChildren, render, rData)
            } else {
              render = getRenderLink(renders.partModelChildren, render, rData)
            }
          } else { // full model
            if (precompiled.formats) {
              render = getRenderLink(renders.fullModelFormatChildren, render, rData)
            } else {
              render = getRenderLink(renders.fullModelChildren, render, rData)
            }
          }
        }
      }
    } else if (children) { // no model, children
      rData = {
        children: children,
        tagEnd: tagEnd,
        each: precompiled.each
      }
      if (typeof precompiled.each !== 'undefined') { // no model, children, each
        if (precompiled.each) {
          render = getRenderLink(renders.NoModelPartialEach, render, rData)
        } else {
          render = getRenderLink(renders.NoModelFullEach, render, rData)
        }
      } else { // no model, children, no each
        render = getRenderLink(renders.NoModelChildren, render, rData)
      }
    }

    render = getRenderLink(renders.closeTag, render, { })

    // Attributes with namesakes
    if (precompiled.nuSakes) {
      render = getRenderLink(renders.nuSakes, render, {
        nuSakes: precompiled.nuSakes,
        namesakes: precompiled.namesakes
      })
    }

    // variable classlist
    if (precompiled.nuClass) {
      render = getRenderLink(renders.nuClass, render, {
        nuClass: precompiled.nuClass,
        classes: precompiled.class || ''
      })
    }

    // variable attributes
    if (precompiled.nuAtts) {
      render = getRenderLink(renders.nuAtts, render, {nuAtts: precompiled.nuAtts})
    }

    // Regular attributes
    if (precompiled.attribs) {
      render = getRenderLink(renders.attribs, render, { attribs: precompiled.attribs })
    }
  }

  // Doctype
  if (precompiled.doctype) {
    render = getRenderLink(renders.doctype, render, {
      out: doctypes[ precompiled.doctype ] + precompiled.start
    })
  } else {
    render = getRenderLink(renders.noDoctype, render, { start: precompiled.start })
  }

  // If
  if (precompiled.nuif) {
    render = getRenderLink(renders.nuif, render, { nuif: precompiled.nuif })
  }

  // Repeat
  if (typeof precompiled.repeat !== 'undefined') {
    if (precompiled.repeat) {
      render = getRenderLink(renders.repeatAll, render, {
        repeat: precompiled.repeat
      })
    } else {
      render = getRenderLink(renders.repeatPart, render, { })
    }
  }

  // Filter
  if (precompiled.nutName && filters[ precompiled.nutName ]) {
    render = getRenderLink(renders.filter, render, {
      filter: filters[ precompiled.nutName ]
    })
  }

  // Inherit + Scope
  if (typeof precompiled.inherit !== 'undefined') {
    let inheritProps = {
      scope: precompiled.scope,
      inherit: precompiled.inherit
    }
    if (precompiled.inherit === '') {
      render = getRenderLink(renders.inheritFull, render, inheritProps)
    } else {
      render = getRenderLink(renders.inheritPart, render, inheritProps)
    }
  } else if (precompiled.scope) {
    render = getRenderLink(renders.scope, render, { scope: precompiled.scope })
  }

  // Launch render
  return function (x, callback, i) {
    render.render('', x, callback, i)
  }
}

const compiler = function (precompiled, children, filters) {
  // compile children
  if (children) {
    children.forEach(function (child) {
      child.render = compiler(child.precompiled, child.finalChildren, filters)
    })
  }
  switch (precompiled.type) {
    case 'tag':
      return tag(precompiled, children, filters)
    case 'text':
      return text(precompiled.data)
    case 'comment':
      if (precompiled.data.slice(0, 7) !== '[CDATA[') {
        return comment(precompiled.data)
      }
      return cdata(precompiled.data)

    case 'directive':
      return directive(precompiled.data)
  }
}

module.exports = compiler
