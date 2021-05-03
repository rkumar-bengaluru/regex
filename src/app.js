

import Expression from "./Expression";
import TestText from "./TestText";
import JsonFormat from "./json/JsonFormat"
let text = new TestText();
let app = new Expression(text);
let json = new JsonFormat();
var res = json.parse('parse this json 123')
console.log(res);

