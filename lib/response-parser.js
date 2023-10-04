const jq = require('jsonpath');
const vars = require('./vars.js');

class Parser {

    parseResponse(template, response) {
        if(template['assign'] && template['assign']['body']) {
            this.parseBody(response.data, template['assign']['body'])
        }
        if(template['assign'] && template['assign']['headers']) {
            this.parseHeader(response.headers, template['assign']['headers'])
        }
    }

    parseBody(body, kv) {
        if(body == null || Object.keys(body).length <= 0) {
            return;
        }
        for(let x of Object.keys(kv)) {
            vars.set(x, jq.query(body, kv[x]));
        }
    }

    parseHeader(headers, kv) {
        if(headers == null || Object.keys(headers).length <= 0) {
            return;
        }
        for(let x of Object.keys(kv)) {
            vars.set(x, headers[kv[x]]);
        } 
    }

}

module.exports = new Parser();