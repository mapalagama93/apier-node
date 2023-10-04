const args = require("./args.js");
const propertiesReader = require('properties-reader');
const fs = require('fs');
const chalk = require("chalk");

class Vars {

    varsPath = args.root + '/configs/vars.properties';

    init() {
        this.loadConfigs();
        this.loadVars();
    }

    loadConfigs() {
        let configPath = args.root + '/configs/config.properties';
        this.config = propertiesReader(configPath);
        for(let e of args.env) {
            let envPath = args.root + '/configs/' + e + '.properties';
            if(fs.existsSync(envPath)) {
                this.config.append(envPath);
            }else{
                console.log(chalk.yellow('env specific properties file not found. env = ' + e));
            }
        }
    }

    loadVars() {
        this.vars = propertiesReader(this.varsPath, {writer: { saveSections: true }});
    }

    get(key, defaultVal = '') {
        if(this.vars.get(key) != null) {
            return this.vars.get(key);
        }
        if(this.config.get(key) != null) {
            return this.config.get(key);
        }
        return defaultVal;
    }

    set(key, value) {
        this.vars.set(key, value);
        this.sync();
        return true;
    }

    sync() {
        let obj = {...this.vars.getAllProperties()};
        let str = '';
        for(let x of Object.keys(obj)) {
            str += x + '=' + obj[x] + '\n';
        }
        fs.writeFileSync(this.varsPath, str);
    }

    all() {
        return {
            ...this.config.getAllProperties(),
            ...this.vars.getAllProperties()
        };
    }

    replaceValues(text) {
        for(let x of Object.keys(this.all())) {
            text = text.replace('{{' + x + '}}', this.get(x));
        }
        return text;
    }
}



module.exports = new Vars();