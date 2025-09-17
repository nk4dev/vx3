import { init } from './pjmake';
//import { rpc } from '../core/rpc/command';
import { SDK_VERSION } from '../config';
import localServer from '../server/dev';

const loadversion = SDK_VERSION

const args = process.argv.slice(2);
// epcmager.main();

// Helper function to parse command line arguments
function parseArgs() {
  const parsed = {
    command: args[0],
    configPath: null,
    flags: []
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-p' || args[i] === '--path') {
      if (i + 1 < args.length) {
        parsed.configPath = args[i + 1];
        i++; // Skip the next argument since it's the path value
      } else {
        console.error('Error: Please provide a path after -p or --path');
        process.exit(1);
      }
    } else if (args[i].startsWith('-')) {
      parsed.flags.push(args[i]);
    }
  }
  
  return parsed;
}

export default async function VXCLI() {
  if (args.length === 0) {
    help();
  }
  
  const parsedArgs = parseArgs();
  
  try {
    switch (parsedArgs.command) {
      case 'init':
        init();
        break;
      case 'help':
        help();
        break;
      case 'serve':
        localServer({ configPath: parsedArgs.configPath });
        return;
      case '--version':
        console.log(`VX version: ${loadversion}`);
        process.exit(0);
      case '-v':
        console.log(`VX version: ${loadversion}`);
        process.exit(0);
      
      default:
        console.error(`😑 < Unknown command: ${parsedArgs.command}`);
        help();
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function help() {
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`XNV version: ${SDK_VERSION}`);
    process.exit(0);
  }

  const stage = "dev";

  const commandlist = [
    {
      command: 'init',
      description: 'Initialize a new project with default settings.'
    }, {
      command: 'create',
      description: 'Create a new project with the specified name.'
    }, {
      command: 'serve',
      description: 'Start a local development server.'
    }, {
      command: 'contract',
      description: 'Interact with a smart contract (browser-based example).'
    }, {
      command: 'dash',
      description: 'Build and serve the dashboard.'
    }, {
      command: 'help',
      description: 'Display this help message.'
    }
  ]

  console.log(`\n🚀 VX v${SDK_VERSION} ${stage}`);
  console.log('Available commands:');
  commandlist.forEach(cmd => {
    console.log(`  ${cmd.command.padEnd(10)} - ${cmd.description}`);
  });
  console.log('\nOptions:');
  console.log('  -p, --path   - Specify path to vx.config.json file');
  console.log('\nExamples:');
  console.log('  vx3 serve -p "../vx.config.json"');
  console.log('  vx3 serve --path "custom/config.json"');
  console.log('\nUse "xnv <command> --help" for more information on a specific command.\n');

  process.exit(0);
}
