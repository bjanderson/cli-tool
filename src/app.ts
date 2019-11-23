import {
  InitJestService,
  InitPrettierService,
  InitTypeScriptService,
  NewModelService,
} from './services';

export class App {
  constructor(
    private initJestService: InitJestService,
    private initPrettierService: InitPrettierService,
    private initTypeScriptService: InitTypeScriptService,
    private newModelService: NewModelService
  ) {}

  run(): void {
    const args = process.argv.slice(2).map((a) => a.toLocaleLowerCase());
    if (this.shouldShowUsage(args)) {
      this.showUsage();
      process.exit(0);
    }

    const command = args.shift();

    switch (command) {
      case 'new':
        this.runNew(args);
        break;
      case 'init':
        this.runInit(args);
        break;
      default:
        this.showUsage();
        process.exit(2);
    }
  }

  runNew(args: string[]): void {
    const subCommand = args.shift();
    switch (subCommand) {
      case 'model':
        this.newModelService.createModel(args);
        break;
      default:
        this.showUsage();
        process.exit(2);
    }
  }

  runInit(args: string[]): void {
    const subCommand = args.shift();
    switch (subCommand) {
      case 'jest':
        this.initJestService.init();
        break;
      case 'prettier':
        this.initPrettierService.init();
        break;
      case 'typescript':
        this.initTypeScriptService.init();
        break;
      default:
        this.showUsage();
        process.exit(2);
    }
  }

  shouldShowUsage(args: string[]): boolean {
    return args.includes('-h') || args.includes('--help');
  }

  showUsage() {
    const usage = `
#################
lernato-cli usage
#################

Commands:

-----------------------------

new \tCreate new things

  model <model-name> \tCreate a new model

    -f, --models-folder <folder/path> \tthe high-level folder that all models are stored in (default: src/models)
    -j, --vanillajs \t\t\tcreate files as js instead of ts

Example:

  lernato-cli new model my-model -f path/to/my-models-folder -l js

-----------------------------

init \tInitialize things in your project

  typescript \tInitialize typesript and tslint
  jest \t\tInitialize jest for unit testing
  prettier \tInitialize prettier for code formatting


Example:

  lernato-cli init typescript

-----------------------------
`;
    console.log(usage);
  }
}
