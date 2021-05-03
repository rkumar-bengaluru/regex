export default class JsonToken {
    constructor(type, match, line, column) {
        this._type = type;
        this._match = match;
        this._line = line;
        this._column = column;
    }

    get type() { return this._type }
    set type(ntype) { this._type = ntype; }

    get match() { return this._match; }
    set match(nmatch) { this._match = nmatch; }

    get line() { return this._line; }
    set line(nline) { this._line = nline; }

    get column() { return this._column; }
    set column(ncolumn) { this._column = ncolumn; }
}