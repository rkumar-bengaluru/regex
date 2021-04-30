export default class MatchPattern {

    get expression() { return this._expression;}
    set expression(newExp) {
        this._expression = newExp;
    }

    get textcm() { return this._textcm;}
    set textcm(newTextCm) {
        this._textcm = newTextCm;
    }

    get result() { return this._result;}
    set result(newTResult) {
        this._result = newTResult;
    }

    get match() {
        let regex = this._getRegex(this._expression);
        if (regex) {
            console.log('finding patterns...');
            this._match(regex, this._textcm, this._result);
        }
    }

    _match(regex, textcm, resultDiv) {
        let array, counter = 0, date1, date2, seconds, currentLineIndex = 0, currentLine;
        date1 = new Date();
        while ((array = regex.exec(textcm.getValue())) !== null) {
            let pos = textcm.posFromIndex(array.index);
            currentLine = pos.line;
            currentLineIndex = pos.ch;
            var len = currentLineIndex + array[0].length;
            textcm.markText({ line: pos.line, ch: currentLineIndex }, { line: pos.line, ch: len }, { className: "styled-background" });

            counter++;
            date2 = new Date();
            seconds = Math.abs(date1 - date2) / 1000;
            if (seconds > 2) {
                break;
            }
        }

        if (seconds > 2) {
            resultDiv.innerHTML = 'Found ' + counter + ' matches @ ' + seconds + ' seconds. Backtracking Detected';
        } else {
            resultDiv.innerHTML = 'Found ' + counter + ' matches @ ' + seconds + ' seconds.';
        }
    }

    _getRegex(expression) {

        if (!expression.match(/^\/.+[^\\]\/[a-z]*$/ig)) {
            console.log('!exp.match(/^\/.+[^\\]\/[a-z]*$/ig)');
            return null;
        }
        if (expression.length < 3) {
            console.log('exp.length < 3');
            return null;
        }

        console.log('_getRegex(str)->' + expression.length);
        let match = expression.match(/^\/(.+)\/([a-z]+)?$/), regex = null;
        console.log('_getRegex(str)...');
        try {
            console.log('_getRegex(str)...in try');
            regex = match ? new RegExp(match[1], match[2] || "") : new RegExp(expression, "g");
            console.log('_getRegex(str)...in last');
        } catch (e) {
            console.log(e);
        }
        console.log('_getRegex(str)...returning...');
        return regex;
    }
}