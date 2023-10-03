import args  from './args.js';
import fs  from 'fs';
import yaml from 'yaml';
import HttpClient  from './http_client.js';

class Runner {
    async run() {
        for(let x of args.file) {
            console.log('start action', x)
            let template = this.parseFile(x);
            console.log(template);
            // execute preAction
            const client = new HttpClient(template.request);
            await client.sendRequest();
            // execute postAction
            console.log('end action', x)
        }
    }

    parseFile(file) {
        let content = this.readFile(file);
        // todo : populate string
        return yaml.parse(content);
    }

    readFile(file) {
        const path = args.root + '/' + file;
        if(!fs.existsSync(path)) {
            console.log('file does not exists');
            process.exit();
        }
        let content = fs.readFileSync(path, 'utf-8');
        return content;
    }
}

export default Runner;