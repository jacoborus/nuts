'use strict';

var renders = function (nut, next) {

	var closer;
	if (nut.children) {
		closer = nut.getPrintChildren( cb );
	} else {
		closer = cb;
	}



	nut.render = function (data, callback) {
		var ending = this.getEnding( callback );
	}
};


module.exports = renders