/**
 * 解决IE8之类不支持getElementsByClassName
 * @param {Object} el 需要使用getElementsByClassName的js原生对象
 */
function classSelector(el) {
	if (!el.getElementsByClassName) {
		el.getElementsByClassName = function(className, element) {
			var children = (element || el).getElementsByTagName('*');
			var elements = new Array();
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				var classNames = child.className.split(' ');
				for (var j = 0; j < classNames.length; j++) {
					if (classNames[j] == className) {
						elements.push(child);
						break;
					}
				}
			}
			return elements;
		};
	}
}
classSelector(document);

/**
 * 打开详情效果
 * @param {Object} el 点击的元素对象
 */
function detailsControl(el) {
	var wrap = el.parentNode;
	classSelector(wrap);
	var details = wrap.getElementsByClassName('js-details')[0];
	details.classList.toggle('js-details-open');
}
