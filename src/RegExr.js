import $ from "./utils/DOMUtils";
import Expression from "./Expression";

export default class RegExr {
    constructor () {  }

    init() {
        console.log('from regexr...');
        this.el = $.query(".container-fluid");
        let el = this.docEl = $.query(".app > .doc", this.el);
        
        this.expression = new Expression();
    }
}