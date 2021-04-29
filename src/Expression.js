import $ from "./utils/DOMUtils";

export default class Expression {
    constructor(text) {
        this.delim = "/";
        this.text = text;
        this.initUI();
    }

    decomposeRegEx(str, delim = "/") {
        let re = new RegExp("^" + delim + "(.*)" + delim + "([igmsuUxy]*)$");
        let match = re.exec(str);
        if (match) {
            return { source: match[1], flags: match[2] };
        } else {
            return { source: str, flags: "g" };
        }
    };

    set value(expression) {
        console.log('value(expression)');
        let regex = this.decomposeRegEx(expression || Expression.DEFAULT_EXPRESSION, this.delim);
        this.pattern = regex.source;
        this.flags = regex.flags;
    }

    get value() {
        console.log('value()');
        return this.editor.getValue();
    }

    set pattern(pattern) {
        console.log('set pattern()');
        let index = this.editor.getValue().lastIndexOf(this.delim);
        this.editor.replaceRange(pattern, { line: 0, ch: 1 }, { line: 0, ch: index });
        console.log('setting pattern');
        this.deferUpdate();
    }

    initUI() {
        //this.editorEl = $.query("> .editor", el);
        this.editorEl = document.getElementById('expressionInput');
        let editor = this.editor = $.createCM(this.editorEl, {
            autofocus: true,
            maxLength: 2500,
            singleLine: true
        });
        editor.on("mousedown", (cm, evt) => this.onEditorMouseDown(cm, evt));
        editor.on("change", (cm, evt) => this.onEditorChange(cm, evt));
        editor.on("keydown", (cm, evt) => this.onEditorKeyDown(cm, evt));
        // hacky method to disable overwrite mode on expressions to avoid overwriting flags:
        editor.toggleOverwrite = () => { };
        this.setInitialExpression();
        editor.setSize(500, 50);
        this.value = Expression.DEFAULT_EXPRESSION;
    }

    onEditorMouseDown(cm, evt) {
        console.log('_onEditorMouseDown->');
    }

    onEditorKeyDown(cm, evt) {
        console.log('evt.ctrlKey->' + evt.ctrlKey);
        if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 68) {
            evt.preventDefault();
            this.pattern = "";
        }
    }

    onEditorChange(cm, evt) {
        console.log('onEditorChange(cm, evt)');
        document.getElementById('result').innerHTML = 'Processing... ';
        document.getElementById('expressiontotest').innerHTML = cm.getValue();
        this.deferUpdate();
        let str = evt.text[0];
        console.log(evt.from.ch + ',' + evt.to.ch + "," + evt.text[0] + ',' + evt.removed + ',' + evt.origin);
        // if (evt.origin == 'paste') {
        //     var text = evt.text[0]; // pasted string
        //     var new_text = '' + text + ''; // any operations here

        //     this.value = new_text;
        //     console.log('paste detected->' + new_text);
        //     return;
        // }

        let myRe = this.getRegex(cm.getValue(), evt);
        console.log('after regex iniit');
        if (myRe) {
            console.log('finding patterns...');
            setTimeout(this.matchPattern(myRe, document.getElementById('editor').value), 2000);
            //this.matchPattern(myRe,document.getElementById('editor').value);
        }
        console.log('after regex...');
        if (str.length < 3 || !str.match(/^\/.+[^\\]\/[a-z]*$/ig) || evt.from.ch !== 1 || evt.to.ch != 1 + evt.removed[0].length) {
            // not pasting a full expression.
            console.log('returning...');
            return;
        }
        console.log('setting value...');
        this.value = str;
    }

    charRect(cm, index) {
        if (index == null) { return null; }
        let pos = cm.posFromIndex(index), rect = cm.charCoords(pos);
        console.log(pos);
        rect.x = rect.left;
        rect.y = rect.top;
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
        return rect;
    }

    matchPattern(myRe, text) {
        let array;
        let counter = 0;
        var date1, date2, seconds;
        date1 = new Date();
        let cm = this.text.cm;
        let currentLineIndex = 0;
        let currentLine = 0;
        while ((array = myRe.exec(text)) !== null) {
            //console.log(`Found ${array[0]}. Next starts at ${myRe.lastIndex}.`);
            counter++;
            //console.log('while loop' + counter);
            date2 = new Date();
            seconds = Math.abs(date1 - date2) / 1000;
            let pos = cm.posFromIndex(array.index);
            currentLine = pos.line;
            currentLineIndex = pos.ch;


            var len = currentLineIndex + array[0].length;
            console.log(pos);
            console.log('marking line->' + pos.line + ', charAt->' + currentLineIndex + ',len->' + len);

            // console.log(this.charRect(this.text.cm,array.index));
            //this.text.cm.getDoc().markText(array.index,len,{ className: "styled-background" });
            cm.markText({ line: pos.line, ch: currentLineIndex }, { line: pos.line, ch: len }, { className: "styled-background" });
            if (seconds > 2) {
                break;
            }
        }
        console.log('result size->' + counter);
        if (seconds > 2) {
            document.getElementById('result').innerHTML = 'Found ' + counter + ' matches @ ' + seconds + ' seconds. Backtracking Detected';
        } else {
            document.getElementById('result').innerHTML = 'Found ' + counter + ' matches @ ' + seconds + ' seconds.';
        }
    }

    deferUpdate() {
        console.log('deferUpdate');
    }

    update() {
        console.log('update');
    }
    // /\b/g
    getRegex(str, evt) {
        if (!str.match(/^\/.+[^\\]\/[a-z]*$/ig)) {
            console.log('!str.match(/^\/.+[^\\]\/[a-z]*$/ig)');
            return null;
        }
        if (str.length < 3) {
            console.log('str.length < 3');
            return null;
        }
        // if (evt.from.ch !== 1) {
        //     console.log('evt.from.ch !== 1');
        //     return null;
        // }
        // if (evt.to.ch != 1 + evt.removed[0].length) {
        //     console.log('evt.to.ch != 1 + evt.removed[0].length');
        //     return null;
        // }

        console.log('getRegex(str)->' + str.length);
        let match = str.match(/^\/(.+)\/([a-z]+)?$/), regex = null;
        console.log('getRegex(str)...');
        try {
            console.log('getRegex(str)...in try');
            regex = match ? new RegExp(match[1], match[2] || "") : new RegExp(str, "g");
            console.log('getRegex(str)...in last');
        } catch (e) {
            console.log(e);
        }
        console.log('getRegex(str)...returning...');
        return regex;
    }


    setInitialExpression() {
        console.log('setInitialExpression(str)');
        let editor = this.editor;
        editor.setValue("/./g");

        // leading /
        editor.getDoc().markText({ line: 0, ch: 0 }, {
            line: 0,
            ch: 1
        }, {
            className: "exp-decorator",
            readOnly: true,
            atomic: true,
            inclusiveLeft: true
        });

        // trailing /g
        editor.getDoc().markText({ line: 0, ch: 2 }, {
            line: 0,
            ch: 4
        }, {
            className: "exp-decorator",
            readOnly: false,
            atomic: true,
            inclusiveRight: true
        });
        this.deferUpdate();
    }


}
Expression.DEFAULT_EXPRESSION = '\\b[A-Z].*?\\b';