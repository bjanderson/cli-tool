import { App } from './app';

const eslintService: any = { init: () => undefined };
const jestService: any = { init: () => undefined };
const modelService: any = { createModel: () => undefined };
const npmService: any = { init: () => undefined };
const prettierService: any = { init: () => undefined };
const serviceService: any = { createService: () => undefined };
const typeScriptService: any = { init: () => undefined };

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  exit: () => undefined,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
};

let app: any;
function init(): void {
  app = new App(
    eslintService,
    jestService,
    modelService,
    npmService,
    prettierService,
    serviceService,
    typeScriptService,
    utilsService
  );
  spyOn(console, 'log').and.returnValue(null);
  spyOn(console, 'warn').and.returnValue(null);
  spyOn(console, 'error').and.returnValue(null);
}

describe('App()', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(app).toBeDefined();
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      init();
      app.showUsage = () => undefined;
      app.runNew = () => undefined;
      app.runInit = () => undefined;
    });

    it('is a function', () => {
      expect(typeof app.run).toEqual('function');
    });

    it('calls showUsage() when shouldShowUsage', () => {
      app.shouldShowUsage = () => true;
      const spy = spyOn(app, 'showUsage').and.callThrough();
      app.run([]);
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.exit(0) when shouldShowUsage', () => {
      app.shouldShowUsage = () => true;
      const spy = spyOn(app.utilsService, 'exit').and.callThrough();
      app.run(['-h']);
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('calls runNew() when !shouldShowUsage && args[0] === "new"', () => {
      app.shouldShowUsage = () => false;
      const spy = spyOn(app, 'runNew').and.callThrough();
      app.run(['new']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls runInit() when !shouldShowUsage && args[0] === "init"', () => {
      app.shouldShowUsage = () => false;
      const spy = spyOn(app, 'runInit').and.callThrough();
      app.run(['init']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls showUsage() by default', () => {
      app.shouldShowUsage = () => false;
      const spy = spyOn(app, 'showUsage').and.callThrough();
      app.run([]);
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.exit(1) by default', () => {
      app.shouldShowUsage = () => false;
      const spy = spyOn(app.utilsService, 'exit').and.callThrough();
      app.run(['-h']);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('runNew()', () => {
    beforeEach(() => {
      init();
      app.showUsage = () => undefined;
    });

    it('is a function', () => {
      expect(typeof app.runNew).toEqual('function');
    });

    it('calls modelService.createModel() when args[0] === "model"', () => {
      const spy = spyOn(app.modelService, 'createModel').and.callThrough();
      app.runNew(['model']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls serviceService.createService() when args[0] === "service"', () => {
      const spy = spyOn(app.serviceService, 'createService').and.callThrough();
      app.runNew(['service']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls showUsage() by default', () => {
      const spy = spyOn(app, 'showUsage').and.callThrough();
      app.runNew([]);
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.exit(1) by default', () => {
      const spy = spyOn(app.utilsService, 'exit').and.callThrough();
      app.runNew(['-h']);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('runInit()', () => {
    beforeEach(() => {
      init();
      app.showUsage = () => undefined;
    });

    it('is a function', () => {
      expect(typeof app.runInit).toEqual('function');
    });

    it('calls eslintService.init() when args[0] === "eslint"', () => {
      const spy = spyOn(app.eslintService, 'init').and.callThrough();
      app.runInit(['eslint']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls jestService.init() when args[0] === "jest"', () => {
      const spy = spyOn(app.jestService, 'init').and.callThrough();
      app.runInit(['jest']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls prettierService.init() when args[0] === "prettier"', () => {
      const spy = spyOn(app.prettierService, 'init').and.callThrough();
      app.runInit(['prettier']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls npmService.init() when args[0] === "npm"', () => {
      const spy = spyOn(app.npmService, 'init').and.callThrough();
      app.runInit(['npm']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls typeScriptService.init() when args[0] === "typescript"', () => {
      const spy = spyOn(app.typeScriptService, 'init').and.callThrough();
      app.runInit(['typescript']);
      expect(spy).toHaveBeenCalled();
    });

    it('calls showUsage() by default', () => {
      const spy = spyOn(app, 'showUsage').and.callThrough();
      app.runInit([]);
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.exit(1) by default', () => {
      const spy = spyOn(app.utilsService, 'exit').and.callThrough();
      app.runInit(['-h']);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('shouldShowUsage()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof app.shouldShowUsage).toEqual('function');
    });

    it('returns true if args includes "-h"', () => {
      const result = app.shouldShowUsage(['-h']);
      expect(result).toEqual(true);
    });

    it('returns true if args includes "--help"', () => {
      const result = app.shouldShowUsage(['--help']);
      expect(result).toEqual(true);
    });

    it('returns false otherwise', () => {
      const result = app.shouldShowUsage(['--test']);
      expect(result).toEqual(false);
    });
  });

  describe('showUsage()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof app.showUsage).toEqual('function');
    });

    it('calls console.log() with the usage instructions', () => {
      const expected = `
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
      app.showUsage();
      expect(console.log).toHaveBeenCalledWith(expected);
    });
  });
});
