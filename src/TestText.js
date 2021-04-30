
import MatchPattern from "./utils/MatchPattern";

export default class TestText {
    constructor(el) {
        this.delim = "/";
        this.matchPattern = new MatchPattern();
        this.init();
    }

    get cm() {
        console.log('get code monitor()');
        return this.editor;
    }

    set expmon(newexpmon) {
        console.log('set setExpMon(expmon)' + newexpmon);
        this._expmon = newexpmon;
    }

    init() {
        console.log('TestText init()');
        this.editorEl = document.getElementById("editor");

        this.editor = CodeMirror.fromTextArea(this.editorEl, {
            lineNumbers: true,
            styleSelectedText: true
        });
        this.editor.on("change", (cm, evt) => this.onTextEditorChange(cm, evt));

        this.editor.setValue(this.editorEl.value);
    }

    onTextEditorChange(cm, evt) {
        console.log('onTextEditorChange(cm, evt)' + this._expmon);
        document.getElementById('result').innerHTML = 'Processing... ';
        if (this._expmon) {
            console.log('finding...');
            this.matchPattern.expression = this._expmon.getValue();
            this.matchPattern.textcm = cm;
            this.matchPattern.result = document.getElementById('result');
            this.matchPattern.match;
        }
    }
}