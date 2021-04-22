import $ from "./utils/DOMUtils";

export default class Expression {
    constructor() {
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

    _initUI() {
        this.editorEl = document.getElementById('expressionInput');
        let editor = this.editor = $.createCM(this.editorEl, {
            autofocus: true,
            maxLength: 2500,
            singleLine: true
        }, "100%", "100%");
        editor.on("mousedown", (cm, evt) => this._onEditorMouseDown(cm, evt));
        editor.on("change", (cm, evt) => this._onEditorChange(cm, evt));
        editor.on("keydown", (cm, evt) => this._onEditorKeyDown(cm, evt));
        // hacky method to disable overwrite mode on expressions to avoid overwriting flags:
        editor.toggleOverwrite = () => { };
        this.value = Expression.DEFAULT_EXPRESSION;
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