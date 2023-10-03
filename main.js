import args from  './lib/args.js';
import initializer from './lib/initializer.js';
import Runner  from './lib/runner.js';


if(args.init) {
    initializer.init();
    process.exit();
}

const runner = new Runner();
runner.run();