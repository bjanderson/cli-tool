import { JestService } from '../jest';
import { ModelService } from '../model';
import { NpmService } from '../npm';
import { PrettierService } from '../prettier';
import { ServiceService } from '../service';
import { TypeScriptService } from '../typescript';
import { UtilsService } from '../utils';

export class CLIService {
  constructor(
    private jestService: JestService,
    private modelService: ModelService,
    private npmService: NpmService,
    private prettierService: PrettierService,
    private serviceService: ServiceService,
    private typeScriptService: TypeScriptService,
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
        this.utilsService.exit(1);
    }
  }

  runNew(args: string[]): void {
    const subCommand = args.shift();
    switch (subCommand) {
      case 'model':
        this.modelService.createModel(args);
        break;
      case 'service':
        this.serviceService.createService(args);
        break;
      default:
        this.showUsage();
        this.utilsService.exit(1);
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
      case 'npm':
        this.npmService.init();
        break;
      case 'typescript':
        this.typeScriptService.init();
        break;
      default:
        this.showUsage();
        this.utilsService.exit(1);
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
    -j, --vanillajs \t\t\tcreate files as vanilla JavaScript instead of TypeScript

  service <service-name> \tCreate a new service
    -f, --services-folder <folder/path> \tthe high-level folder that all services are stored in (default: src/services)
    -j, --vanillajs \t\t\t\tcreate files as vanilla JavaScript instead of TypeScript

Example:

  lernato-cli new model my-model -f path/to/my-models-folder -j
  lernato-cli new service my-service -f path/to/my-services-folder -j

-----------------------------

init \tInitialize things in your project

  npm \tInitialize npm

  typescript \tInitialize typescript and tslint

  jest \t\tInitialize jest for unit testing

  prettier \tInitialize prettier for code formatting

Example:

  lernato-cli init typescript

-----------------------------
`;
    console.log(usage);
  }
}
