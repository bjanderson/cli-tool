import { TypeScriptService } from './typescript.service';
import { NpmDependencyType } from '../../enums';

const npmService: any = {
  getPackageJson: () => ({}),
  init: () => undefined,
  installPackages: () => undefined,
  writePackageJson: () => undefined,
};

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  getFileAsJson: () => {},
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
  writeJsonFile: () => undefined,
};

let service: any;
function init(): void {
  service = new TypeScriptService(npmService, utilsService);
}

describe('TypeScriptService()', () => {
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
      service.updatePackageJson = () => undefined;
      service.createTSConfig = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });

    it('calls npmService.init()', () => {
      const spy = spyOn(service.npmService, 'init').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls updatePackageJson()', () => {
      const spy = spyOn(service, 'updatePackageJson').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls createTSConfig()', () => {
      const spy = spyOn(service, 'createTSConfig').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updatePackageJson()', () => {
    beforeEach(() => {
      init();
      service.installPackages = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.updatePackageJson).toEqual('function');
    });

    it('calls npmService.getPackageJson()', () => {
      const spy = spyOn(service.npmService, 'getPackageJson').and.callThrough();
      service.updatePackageJson();
      expect(spy).toHaveBeenCalled();
    });

    it('calls npmService.writePackageJson()', () => {
      const json = {
        scripts: {
          build: 'tsc',
          start: 'ts-node src/index.ts',
          'start:build': 'node build/index.js',
          watch: 'npm-watch',
        },
        watch: {
          build: {
            patterns: ['src'],
            extensions: 'ts',
          },
        },
      };
      const spy = spyOn(service.npmService, 'writePackageJson').and.callThrough();
      service.updatePackageJson();
      expect(spy).toHaveBeenCalledWith(json);
    });

    it('calls installPackages()', () => {
      const spy = spyOn(service, 'installPackages').and.callThrough();
      service.updatePackageJson();
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
      expect(spy).toHaveBeenCalledWith(
        ['typescript', '@types/node', 'npm-watch', 'ts-node'],
        NpmDependencyType.DEV_DEPENDENCY
      );
    });
  });

  describe('createTSConfig()', () => {
    beforeEach(() => {
      init();
      service.writeTSConfigJson = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.createTSConfig).toEqual('function');
    });

    it('calls writeTSConfigJson()', () => {
      const config = {
        compilerOptions: {
          target: 'es5',
          module: 'commonjs',
          lib: ['esnext'],
          declaration: true,
          outDir: './dist',
          rootDir: './src',
          types: ['node'],
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
        },
      };
      const spy = spyOn(service, 'writeTSConfigJson').and.callThrough();
      service.createTSConfig();
      expect(spy).toHaveBeenCalledWith(config);
    });
  });

  describe('getTSConfigJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getTSConfigJson).toEqual('function');
    });

    it('calls utilsService.getFileAsJson()', () => {
      const spy = spyOn(service.utilsService, 'getFileAsJson').and.callThrough();
      service.getTSConfigJson();
      expect(spy).toHaveBeenCalledWith(service.tsConfigJsonFile);
    });
  });

  describe('writeTSConfigJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writeTSConfigJson).toEqual('function');
    });

    it('calls utilsService.writeJsonFile()', () => {
      const json = { test: 'json' };
      const spy = spyOn(service.utilsService, 'writeJsonFile').and.callThrough();
      service.writeTSConfigJson(json);
      expect(spy).toHaveBeenCalledWith(service.tsConfigJsonFile, json);
    });
  });
});
