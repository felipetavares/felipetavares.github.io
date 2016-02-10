// (quadratic) sinusoidal interpolator
function si (dx, y0, y1) {
    this.x0 = new Date()/1000;
    this.x1 = this.x0 + dx;
    this.y0 = y0;
    this.y1 = y1;
    this.fn = null;
    this.timer = null;

    this.undef = function () {
	return {
	    'def': function () {
		return false;
	    }
	};
    }

    // is the interpolator defined for a given value?
    this.def = function (x) {
	if (x === undefined)
	    x = new Date()/1000;

	return x < this.x1;
    }

    this.get = function (x) {
	if (x === undefined)
	    x = new Date()/1000;

	if (x > this.x1)
	    return this.y1;

	var p = Math.sin((x-this.x0)/(this.x1-this.x0)*Math.PI/2);

	return this.y0+(this.y1-this.y0)*p*p;
    }

    this.run = function (fn) {
	this.fn = (function () {
	    if (this.def()) {
		requestAnimationFrame(this.fn);
	    }

	    fn(this);
	    
	}).bind(this);

	requestAnimationFrame(this.fn);
    }
}
