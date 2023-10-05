const args = require('./args.js');
const fs = require('fs');
const yaml = require('yaml');
const HttpClient = require('./http_client.js');
const chalk = require('chalk');
const parser = require('./response-parser.js');
const vars = require('./vars.js');
const scriptRunner = require('./script-runner.js');

class Runner {
    async run() {
        for (let x of args.file || []) {
            console.log(chalk.bgYellow.bold(' START ACTION ' + x + ' '));
            let template = this.parseFile(x);
            // execute preAction
            if (template['preAction'] && template['preAction']['script']) {
                scriptRunner.run(template['preAction']['script'], {
                    self : template
                });
                template = this.parseFile(x);
            }
            // run request
            const client = new HttpClient(template.request);
            if (args.curl) {
                client.printCurl();
                console.log(chalk.bgYellow.bold(' END ACTION ' + x + ' \n'));
                continue;
            } else {
                let response = await client.sendRequest();
                parser.parseResponse(template, response);
            }
            // execute postAction
            if (template['postAction'] && template['postAction']['script']) {
                scriptRunner.run(template['postAction']['script'], {
                    self : template,
                    response: client.response
                });
            }
            console.log(chalk.bgYellow.bold(' END ACTION ' + x + ' \n'));
        }
    }

    parseFile(file) {
        let content = this.readFile(file);
        content = vars.replaceValues(content);
        return yaml.parse(content);
    }

    readFile(file) {
        const path = args.root + '/' + file;
        if (!fs.existsSync(path)) {
            console.log('file does not exists');
            process.exit();
        }
        let content = fs.readFileSync(path, 'utf-8');
        return content;
    }
}

module.exports = Runner;