
import JsonParser from './JsonParser'

export default class JsonFormat {
    
    parse(input) {
        try {
            return JsonParser.runParser(input, null);
        } catch (e) {
            console.error(e);
            console.error(e.line + ': ' + e.message)
        }
    }
}
