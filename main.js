const args =  require('./lib/args.js');
const initializer = require('./lib/initializer.js');
const Runner  = require('./lib/runner.js');
const vars = require('./lib/vars.js');


if(args.init) {
    initializer.init();
    process.exit();
}

vars.init();

const runner = new Runner();
runner.run();