import { PrettierService } from './prettier.service';
import { NpmDependencyType } from '../../enums';

const npmService: any = {
  installPackages: () => undefined,
};

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
  writeJsonFile: () => undefined,
};

let service: any;
function init(): void {
  service = new PrettierService(npmService, utilsService);
}

describe('PrettierService()', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });

  describe('init()', () => {
    beforeEach(() => {
      init();
      service.installPackages = () => undefined;
      service.createPrettierConfig = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });

    it('calls installPackages()', () => {
      const spy = spyOn(service, 'installPackages').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls createPrettierConfig()', () => {
      const spy = spyOn(service, 'createPrettierConfig').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('installPackages()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.installPackages).toEqual('function');
    });

    it('calls npmService.installPackages()', () => {
      const spy = spyOn(service.npmService, 'installPackages').and.callThrough();
      service.installPackages();
      expect(spy).toHaveBeenCalledWith(['prettier'], NpmDependencyType.DEV_DEPENDENCY);
    });
  });

  describe('createPrettierConfig()', () => {
    beforeEach(() => {
      init();
      service.writePrettierConfig = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.createPrettierConfig).toEqual('function');
    });

    it('calls writePrettierConfig()', () => {
      const config = {
        arrowParens: 'always',
        bracketSpacing: true,
        endOfLine: 'auto',
        htmlWhitespaceSensitivity: 'css',
        jsxBracketSameLine: true,
        jsxSingleQuote: false,
        quoteProps: 'as-needed',
        printWidth: 100,
        proseWrap: 'preserve',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      };
      const spy = spyOn(service, 'writePrettierConfig').and.callThrough();
      service.createPrettierConfig();
      expect(spy).toHaveBeenCalledWith(config);
    });
  });

  describe('writePrettierConfig()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writePrettierConfig).toEqual('function');
    });

    it('calls utilsService.writeJsonFile()', () => {
      const json = { test: 'json' };
      const spy = spyOn(service.utilsService, 'writeJsonFile').and.callThrough();
      service.writePrettierConfig(json);
      expect(spy).toHaveBeenCalledWith(service.prettierConfigFile, json);
    });
  });
});
