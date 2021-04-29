import $ from "./utils/DOMUtils";

export default class TestText {
    constructor(el) {
        this.delim = "/";
        this.initUI();
    }

    get cm() {
        console.log('get code monitor()');
        return this.editor;
    }

    initUI() {
        this.editorEl = document.getElementById("editor");

        this.editor = CodeMirror.fromTextArea(this.editorEl, {
            lineNumbers: true,
            styleSelectedText: true
        });


        this.editor.setValue(this.editorEl.value);
    }
}