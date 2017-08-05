// JavaScript Document
/*
**动态设置HTML标签的font-size值
*/
(function (doc, win) {
	'use strict';
	var FONTSIZE = 10,
		docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) {return;}
			docEl.style.fontSize = FONTSIZE * (clientWidth / 640) + 'px';
		};
	
	if (!doc.addEventListener) {return;}
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

//百度统计JS
var _hmt = _hmt || [];
(function() {
	'use strict';
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?1e3813b44e0c10f0976d40134d1bdea9";
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
})();