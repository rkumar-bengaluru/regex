import JsonToken from "./JsonToken";
export default class JsonLexer {
    constructor(input, src) {
        this._input = input;
        this._src = src;
        this._tokenTypes = { openBrace: '{', closeBrace: '}', openBracket: '[', closeBracket: ']', endOfFile: 'EOF' }
        this._nextChar = this.readChar();
        this._nextToken = this.readToken();
    }

    get tokenTypes() {
        return this._tokenTypes;
    }

    readToken() {
        return new JsonToken(this._tokenTypes.endOfFile,'',19,21);
    }

    readChar() {
        return this._input[0];
    }

    testToken(type) {
        console.log('_nextToken-' + this._nextToken.type + ', input->' + type);
        return this._nextToken.type === type;
    }

    createParseException(token, message) {
        return createParseException(token.line, token.column, message);
    }

    createParseException( line,  column,  message) {
        var instance = new Error(message,line, column);
		return instance;
	}

    useToken() {
		let res = this._nextToken;
		this._nextToken = this.readToken();
		return res;
	}

}
