"use strict";

var Tiles = {
    'position': 0,
    'interp': new si().undef(),
    'tiles': [],

    'isOpen': function (n) {
	if (n >= Tiles.tiles.length)
	    return false;
	return Tiles.tiles[n].open;
    },
    'getScreen': function () {
	return document.getElementsByClassName('screen')[0];
    },
    'getScreenIndicator': function () {
	return document.getElementsByClassName('screen-indicator')[0];
    },
    'selectIndicator': function (n) {
	var screenIndicator = Tiles.getScreenIndicator();
	screenIndicator.children[n].style.background = '#c23';
    },
    'unselectIndicator': function (n) {
	var screenIndicator = Tiles.getScreenIndicator();
	screenIndicator.children[n].style.background = '#a24';
    },
    'add': function (tile) {
	tile.style.left = (100*Tiles.tiles.length)+'%';

	var indicatorTile = document.createElement('div');
	indicatorTile.classList.add('indicator-tile');
	indicatorTile.style.left = (12*Tiles.tiles.length)+'px';
	var n = Tiles.tiles.length;
	indicatorTile.addEventListener ('click', function () {
	    Tiles.scrollTo(n);
	}, false);

	Tiles.tiles.push(tile);
	var screen = Tiles.getScreen();
	screen.appendChild(tile);
	var screenIndicator = Tiles.getScreenIndicator();
	screenIndicator.appendChild(indicatorTile);

	Tiles.selectIndicator(Tiles.position);
    },
    'copyElements': function (from, to) {
      for (var i=0;i<from.children.length; i++) {
        to.appendChild(from.children[i]);
      }
    },
    'new': function (title, iconPath, contentId) {
	var tile = document.createElement('div');
	tile.classList.add('tile');
	tile.pos = 0;

	var cover = document.createElement('div');
	cover.classList.add('tile-cover');

	var content = document.createElement('div');
	content.classList.add('tile-content');

	if (contentId !== undefined) {
	    var contentTemplate = document.getElementById(contentId);

        Tiles.copyElements(contentTemplate, content);
	}

	var text = document.createElement('div');
	text.classList.add('tile-text');
	text.innerHTML = title;

	var enter = document.createElement('div');
	enter.classList.add('tile-enter');

	var id = Tiles.tiles.length;
	enter.addEventListener('click', function () {
	    Tiles.open(id);
	}, false);

	var icon = document.createElement('div');
	icon.classList.add('tile-icon');
	icon.style.backgroundImage = iconPath;

	cover.appendChild(icon);
	cover.appendChild(text);
	cover.appendChild(enter);

	var close = document.createElement('div');
	close.classList.add('close');

	close.addEventListener('click', function () {
	    Tiles.close(id);
	}, false);
	content.appendChild(close);

	tile.appendChild(content);
	tile.appendChild(cover);

	return tile;
    },
    'canNext': function () {
	return Tiles.position < Tiles.tiles.length-1 && !Tiles.interp.def();
    },
    'canPrev': function () {
	return Tiles.position > 0 && !Tiles.interp.def();
    },
    'next': function () {
	if (Tiles.canNext()) {
	    if (Tiles.isOpen(Tiles.position)) {
		Tiles.close(Tiles.position);
	    }

	    Tiles.unselectIndicator(Tiles.position);

	    Tiles.interp = new si(0.7, Tiles.position, Tiles.position+1);
	    Tiles.interp.run(Tiles.interpFn);

	    Tiles.position ++;

	    Tiles.selectIndicator(Tiles.position);
	}
    },
    'prev': function () {
	if (Tiles.canPrev()) {
	    if (Tiles.isOpen(Tiles.position)) {
		Tiles.close(Tiles.position);
	    }

	    Tiles.unselectIndicator(Tiles.position);

	    Tiles.interp = new si(0.7, Tiles.position, Tiles.position-1);
	    Tiles.interp.run(Tiles.interpFn);

	    Tiles.position --;

	    Tiles.selectIndicator(Tiles.position);
	}
    },
    'scrollTo': function (n) {
	if (Tiles.isOpen(Tiles.position)) {
	    Tiles.close(Tiles.position);
	}

	Tiles.unselectIndicator(Tiles.position);

	Tiles.interp = new si(0.7, Tiles.position, n);
	Tiles.interp.run(Tiles.interpFn);

	Tiles.position = n;

	Tiles.selectIndicator(Tiles.position);
    },
    'interpFn': function (i) {
	Tiles.getScreen().scrollLeft = i.get()*document.body.clientWidth;
    },
    'moveCover': function (i) {
	var screen = Tiles.getScreen();
    var screenIndicator = Tiles.getScreenIndicator();

	screen.children[i.n].children[1].style.top = (i.get()*100)+"%";
    screenIndicator.style.top = ((2*screenIndicator.offsetHeight+screenIndicator.clientHeight)*i.get())+'px';

	Tiles.tiles[i.n].pos = i.get();
    },
    'open': function (n) {
	var i = new si(0.6, Tiles.tiles[n].pos, -1);
	i.n = n;
	i.run(Tiles.moveCover);
	Tiles.tiles[n].open = true;
    },
    'close': function (n) {
	var i = new si(0.6, Tiles.tiles[n].pos, 0);
	i.n = n;
	i.run(Tiles.moveCover);
	Tiles.tiles[n].open = false;
    }
};

(function () {
    Tiles.getScreen().addEventListener('wheel', function (event) {
	var e = event.target;
	while (e.parentElement != null) {
	    e = e.parentElement;
	    if (e.classList.contains('tile-content'))
		return;
	}

	event.preventDefault();

	if (event.deltaX > 0 || event.deltaY < 0) {
	    Tiles.next();
	    return;
	}

	if (event.deltaX < 0 || event.deltaY > 0) {
	    Tiles.prev();
	    return;
	}

	return true;
    }, false);

    window.addEventListener('resize', function (event) {
	Tiles.getScreen().scrollLeft = Tiles.position*document.body.clientWidth;
    }, false);
})();
