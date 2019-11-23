import { JestService } from '../jest';
import { NewModelService } from '../new-model';
import { PrettierService } from '../prettier';
import { TypeScriptService } from '../typescript';
import { UtilsService } from '../utils';

export class CLIService {
  constructor(
    private jestService: JestService,
    private prettierService: PrettierService,
    private typeScriptService: TypeScriptService,
    private newModelService: NewModelService,
    private utilsService: UtilsService
  ) {}

  run(args: string[]): void {
    if (this.shouldShowUsage(args)) {
      this.showUsage();
      this.utilsService.exit(0);
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
        this.utilsService.exit(2);
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
        this.utilsService.exit(2);
    }
  }

  runInit(args: string[]): void {
    const subCommand = args.shift();
    switch (subCommand) {
      case 'jest':
        this.jestService.init();
        break;
      case 'prettier':
        this.prettierService.init();
        break;
      case 'typescript':
        this.typeScriptService.init();
        break;
      default:
        this.showUsage();
        this.utilsService.exit(2);
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
