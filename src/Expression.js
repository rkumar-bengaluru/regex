import $ from "./utils/DOMUtils";

export default class Expression {
    constructor (el) {
        
        this.delim = "/";
        
        this._initUI();
    }

    set value(expression) {
		let regex = $.decomposeRegEx(expression || Expression.DEFAULT_EXPRESSION, this.delim);
		this.pattern = regex.source;
		this.flags = regex.flags;
        console.log(regex);
        
	}

    get value() {
		return this.editor.getValue();
	}

    set pattern(pattern) {
		let index = this.editor.getValue().lastIndexOf(this.delim);
		this.editor.replaceRange(pattern, {line: 0, ch: 1}, {line: 0, ch: index});
        console.log('setting pattern');
		this._deferUpdate();
	}

    _initUI() {
        //this.editorEl = $.query("> .editor", el);
        this.editorEl = document.getElementById('expressionInput');
        console.log(this.editorEl);
        let editor = this.editor = $.createCM(this.editorEl, {
            autofocus: true,
            maxLength: 2500,
            singleLine: true
        });
        editor.on("mousedown", (cm, evt) => this._onEditorMouseDown(cm, evt));
        editor.on("change", (cm, evt) => this._onEditorChange(cm, evt));
        editor.on("keydown", (cm, evt) => this._onEditorKeyDown(cm, evt));
        // hacky method to disable overwrite mode on expressions to avoid overwriting flags:
        editor.toggleOverwrite = () => { };
        this._setInitialExpression();
        editor.setSize(500,50);
        this.value = Expression.DEFAULT_EXPRESSION;
    }

    _onEditorMouseDown(cm, evt) {
		// offset by half a character to make accidental clicks less likely:
		//let index = CMUtils.getCharIndexAt(cm, evt.clientX - cm.defaultCharWidth() * 0.6, evt.clientY);
		///if (index >= cm.getValue().lastIndexOf(this.delim)) {
		//	this.showFlags();
		//}
        console.log('_onEditorMouseDown->');
	}

    _onEditorKeyDown(cm, evt) {
		// Ctrl or Command + D by default, will delete the expression and the flags field, Re: https://github.com/gskinner/regexr/issues/74
		// So we just manually reset to nothing here.
        console.log('evt.ctrlKey->' + evt.ctrlKey);
		if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 68) {
			evt.preventDefault();
			this.pattern = "";
		}
	}

    _onEditorChange(cm, evt) {
		// catches pasting full expressions in.
		// TODO: will need to be updated to work with other delimeters
		this._deferUpdate();
		let str = evt.text[0];
        let new_tex = ''+str+'';
        console.log('str->' + new_tex);
        console.log('str.length->' + str.length);
        console.log('str.match->' + str.match(/^\/.+[^\\]\/[a-z]*$/ig));
        console.log('evt.from.ch->' + evt.from.ch);
        console.log('evt.to.ch->' + evt.to.ch);
        console.log('evt.removed[0]->' + evt.removed[0]);
        console.log('evt.removed[0].length->' + evt.removed[0]);
        if (evt.origin == 'paste') {
            var text = evt.text[0]; // pasted string
            var new_text = ''+text+''; // any operations here
            
            this.value = new_text;
            console.log('paste detected->' + new_text);
            return;
        }
		if (str.length < 3 || !str.match(/^\/.+[^\\]\/[a-z]*$/ig) || evt.from.ch !== 1 || evt.to.ch != 1 + evt.removed[0].length) {
			// not pasting a full expression.
			return;
		}
		this.value = str;
	}

    _deferUpdate() {
		console.log('_deferUpdate');
	}

    _update() {
		console.log('_update');
	}


    _setInitialExpression() {
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
        this._deferUpdate();
    }

    
}
Expression.DEFAULT_EXPRESSION = "/([A-Z])\\w+/g";