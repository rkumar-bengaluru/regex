import JsonLexer from "./JsonLexer";

export default class JsonParser {
    
    constructor(input,src,lexer) {
        this._input = input;
        this._src = src;
        this._lexer = lexer;
    }

    static parse() {
        return this._input + ' after processing';
    }

    static runParser(input, src) {
        this._input = input;
        this._src = src;
        this._lexer = new JsonLexer(this._input,this._src);
        if (!this._lexer.testToken(this._lexer.tokenTypes.endOfFile)) {
			throw this._createParseExceptionUnexpectedToken("end of file");
		}
        return this.parse();
    }

    static _createParseExceptionUnexpectedToken(expected) {
        return this._lexer.createParseException(this._lexer.useToken(), "Expected " + expected);
    }
}

export function runParser(input) {
    JsonParser.runParser(input);
}