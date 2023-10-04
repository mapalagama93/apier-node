const vars = require("./vars.js");
const args = require("./args.js");
const vm = require("node:vm");
const fs = require('fs');
class ScriptRunner {
    

    run(script, ctx) {
        this.readScriptFiles(ctx);
        this.evalScript(script, ctx);
    }

    evalScript(script, ctx) {
        let set = (k, v) => {
            return vars.set(k, v);
        }
        let get = (k, v = '') => {
            return vars.get(k, v);
        }
        
        let header = "(require, set, get, args, ctx)";
        vm.runInThisContext("(" + header + " => {" + script + "})")(require, set, get, args, ctx);
    }

    readScriptFiles(ctx) {
        if(vars.get('scripts_dir', null) == null) {
            return [];
        }
        let scriptDir = args.root + '/' + vars.get('scripts_dir');
        for(let x of fs.readdirSync(scriptDir)) {
            if(x.endsWith('.js')) {
                let content = fs.readFileSync(scriptDir + '/' + x, 'utf-8');
                this.evalScript(content, ctx);
            }
        }
    }

}
module.exports = new ScriptRunner();