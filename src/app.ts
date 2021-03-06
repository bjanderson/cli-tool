import {
  JestService,
  ModelService,
  NpmService,
  PrettierService,
  ServiceService,
  TypeScriptService,
  UtilsService,
} from './services';
import { EslintService } from './services/eslint';

export class App {
  constructor(
    private eslintService: EslintService,
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
      case 'eslint':
        this.eslintService.init(args);
        break;
      case 'jest':
        this.jestService.init(args);
        break;
      case 'prettier':
        this.prettierService.init(/* args */);
        break;
      case 'npm':
        this.npmService.init(args);
        break;
      case 'typescript':
        this.typeScriptService.init(args);
        break;
      default:
        this.showUsage();
        this.utilsService.exit(1);
    }
  }

  shouldShowUsage(args: string[]): boolean {
    return args.includes('-h') || args.includes('--help');
  }

  showUsage(): void {
    const usage = `
###########
cli-tool
###########

Usage:

-h, --help \tShow these usage instructions

-----------------------------

new \tCreate new things

  model <model-name> \t\tCreate a new model
    -f, --models-folder <folder/path> \t\tthe high-level folder that all models are stored in (default: src/models)
    -j, --vanillajs \t\t\t\tcreate files as vanilla JavaScript instead of TypeScript

  service <service-name> \tCreate a new service
    -f, --services-folder <folder/path> \tthe high-level folder that all services are stored in (default: src/services)
    -j, --vanillajs \t\t\t\tcreate files as vanilla JavaScript instead of TypeScript

Example:

  cli-tool new model my-model -f path/to/my-models-folder -j
  cli-tool new service my-service -f path/to/my-services-folder -j

-----------------------------

init \tInitialize things in your project

  eslint \t\tInitialize eslint
    -j, --vanillajs \t\t\t Initialize eslint for a vanilla JavaScript project instead of TypeScript
    -n, --nodejs \t\t\t Initialize eslint for a nodejs project instead of the browser

  jest \t\tInitialize jest for unit testing

  npm \t\tInitialize npm

  prettier \tInitialize prettier for code formatting

  typescript \tInitialize typescript and tslint

Example:

  cli-tool init typescript

-----------------------------
`;
    console.log(usage);
  }
}
