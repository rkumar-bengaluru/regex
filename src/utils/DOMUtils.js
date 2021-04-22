let DOMUtils = {}, $ = DOMUtils;
export default DOMUtils;

$.create = function(type, className, content, parent) {
	let element = document.createElement(type || "div");
	if (className) { element.className = className; }
	if (content) {
		if (content instanceof HTMLElement) { element.appendChild(content); }
		else { element.innerHTML = content; }
	}
	if (parent) { parent.appendChild(element); }
	return element;
};

$.copy = function(target, source) {
	for (let n in source) { target[n] = source[n]; }
	return target;
}

$.createCM = function(target, opts = {}, width = "100%", height = "100%") {
    let o = $.copy({
        lineNumbers: false,
        tabSize: 3,
        indentWithTabs: true,
        specialChars: /[ \u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/,
        specialCharPlaceholder: (ch) => $.create("span", ch === " " ? "cm-space" : "cm-special", " ") // needs to be a space so wrapping works
    }, opts);
    let cm = CodeMirror(target, o);
    return cm;
}

$.decomposeRegEx = function(str, delim="/") {
	let re = new RegExp("^"+delim+"(.*)"+delim+"([igmsuUxy]*)$");
	let match = re.exec(str);
	if (match) {
		return {source: match[1], flags: match[2]};
	} else {
		return {source: str, flags: "g"};
	}
};