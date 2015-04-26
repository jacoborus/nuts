'use strict';

var doctypes = require('./doctypes.json'),
	renders = require('./renders.js');


var text = function (elData) {
	return function (x, callback, i) {
		callback( elData, i );
	};
};

var comment = function (elData) {
	var out = '<!--' + elData + '-->';
	return function (x, callback, i) {
		callback( out, i );
	};
};

var cdata = function (elData) {
	var out = '<!' + elData + '>';
	return function (x, callback, i) {
		callback( out, i );
	};
};

var directive = function (elData) {
	var out = '<' + elData + '>';
	return function (x, callback, i) {
		callback( out, i );
	};
};



var getRenderLink = function (fn, next, props) {
	var r = {},
		i;
	for (i in props) {
		r[i] = props[i];
	}
	r.render = fn;
	r.next = next;
	return r;
};



var tag = function (precompiled, children, filters) {
	var tagEnd =  '</' + precompiled.name + '>',
		render, rData;

	if (precompiled.voidElement) {
		render = {
			render: function (out, x, cb, pos) {
				cb( out + '>', pos );
			}
		};

	} else {
		render = {
			render: function (out, x, cb, pos) {
				cb( out + tagEnd, pos );
			}
		};

		if (typeof precompiled.model !== 'undefined') {
			if (!children) { // model, no children
				render = getRenderLink( renders.modelNoChildren, render, {
					model: precompiled.model
				});

			} else { // model, children
				if (typeof precompiled.each !== 'undefined') { // model, children, each
					rData = {
						model: precompiled.model,
						children: children,
						renderChildren: renders.renderChildren
					};
					if (precompiled.each !== '') {
						render = getRenderLink( renders.modelChildrenEachFull, render, rData );
					} else {
						render = getRenderLink( renders.modelChildrenEachPart, render, rData );
					}
				} else { // model, children, no each
					render = getRenderLink( renders.modelChildren, render, {
						model: precompiled.model,
						children: children,
						renderChildren: renders.renderChildren
					});
				}
			}

		} else if (children) { // no model, children
			if (typeof precompiled.each !== 'undefined') { // no model, children, each
				rData = {
					children: children,
					renderChildren: renders.renderChildren,
					tagEnd: tagEnd,
					each: precompiled.each
				};
				if (precompiled.each !== '') {
					render = getRenderLink( renders.NoModelChildrenEachPart, render, rData );
				} else {
					render = getRenderLink( renders.NoModelChildrenEachFull, render, rData );
				}

			} else { // no model, children, no each
				render = getRenderLink( renders.NoModelChildren, render, {
					children: children,
					renderChildren: renders.renderChildren
				});
			}

		}
		render = getRenderLink( renders.noModelNoChildren, render, { });

		/* --- TAG ATTRIBUTES --- */
		// Attributes with namesakes
		if (precompiled.nuSakes) {
			render = getRenderLink( renders.nuSakes, render, {
				nuSakes: precompiled.nuSakes,
				namesakes: precompiled.namesakes
			});
		}

		// variable classlist
		if (precompiled.nuClass) {
			render = getRenderLink( renders.nuClass, render, {
				nuClass: precompiled.nuClass,
				classes: precompiled.class || ''
			});
		}


		// variable attributes
		if (precompiled.nuAtts) {
			render = getRenderLink( renders.nuAtts, render, { nuAtts : precompiled.nuAtts });
		}

		// Regular attributes
		if (precompiled.attribs) {
			render = getRenderLink( renders.attribs, render, { attribs: precompiled.attribs });
		}

	}

	// Doctype
	if (precompiled.doctype) {
		render = getRenderLink( renders.doctype, render, { out: doctypes[ precompiled.doctype ] + precompiled.start });
	} else {
		render = getRenderLink( renders.noDoctype, render, { start: precompiled.start	});
	}

	// If
	if (precompiled.nuif) {
		render = getRenderLink( renders.nuif, render, { nuif: precompiled.nuif });
	}

	// Repeat
	if (typeof precompiled.repeat !== 'undefined') {
		if (precompiled.repeat) {
			render = getRenderLink( renders.repeatAll, render, {
				repeat: precompiled.repeat,
				renderRepeat: renders.renderRepeat
			});
		} else {
			render = getRenderLink( renders.repeatPart, render, { renderRepeat: renders.renderRepeat });
		}
	}

	// Filter
	if (precompiled.nutName && filters[ precompiled.nutName ]) {
		render = getRenderLink( renders.filter, render, {
			filter: filters[ precompiled.nutName ]
		});
	}

	// Inherit + Scope
	if (typeof precompiled.inherit !== 'undefined') {
		var inheritProps = {
			scope: precompiled.scope,
			inherit: precompiled.inherit
		};
		if (precompiled.inherit === '') {
			render = getRenderLink( renders.inheritFull, render, inheritProps );
		} else {
			render = getRenderLink( renders.inheritPart, render, inheritProps );
		}
	} else if (precompiled.scope) {
		render = getRenderLink( renders.scope, render, { scope: precompiled.scope });
	}

	// Launch render
	return function (x, callback, i) {
		render.render( '', x, callback, i );
	};
};


var compiler = function (precompiled, children, filters) {
	// compile children
	if (children) {
		children.forEach( function (child) {
			child.render = compiler( child.precompiled, child.finalChildren, filters );
		});
	}
	switch (precompiled.type) {
		case 'tag':
			return tag( precompiled, children, filters );
		case 'text':
			return text( precompiled.data );
		case 'comment':
			if (precompiled.data.slice(0, 7) !== '[CDATA[') {
				return comment( precompiled.data );
			}
			return cdata( precompiled.data );

		case 'directive':
			return directive( precompiled.data );
	}
};

module.exports = compiler;
