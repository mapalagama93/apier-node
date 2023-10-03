import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

class ArgsParser {
  generateHelpText() {
    const usageOptions = [
      {
        header: 'A typical app',
        content: 'Generates something {italic very} important.'
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'input',
            typeLabel: '{underline file}',
            description: 'The input to process.'
          },
          {
            name: 'help',
            description: 'Print this usage guide.'
          }
        ]
      }
    ];
    return commandLineUsage(usageOptions);
  }

  parseArgs() {
    try {
      const options = [
        {
          name: 'init',
          alias: 'i',
          type: Boolean
        },
        {
          name: 'help',
          alias: 'h',
          type: Boolean
        },
        {
          name: 'curl',
          alias: 'c',
          type: Boolean
        },
        {
          name: 'env',
          alias: 'e',
          type: String,
          multiple: true,
          defaultOption: []
        },
        {
          name: 'file',
          alias: 'f',
          type: String,
          multiple: true,
          defaultOption: []
        }
      ];
      return commandLineArgs(options);
    } catch (e) {
      console.log(e.message);
      process.exit();
    }
  }
}

let argsParser = new ArgsParser();
let args = argsParser.parseArgs();
if(args.help) {
  console.log(argsParser.generateHelpText());
  process.exit();
}

export default {
  root : process.cwd(), ...args
}