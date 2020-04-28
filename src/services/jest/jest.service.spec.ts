import { JestService } from './jest.service';
import { FileExtension, NpmDependencyType } from '../../enums';

const npmService: any = {
  getPackageJson: () => ({}),
  installPackages: () => undefined,
  writePackageJson: () => undefined,
};

const typeScriptService: any = {
  getTSConfigJson: () => ({ compilerOptions: { types: [] } }),
  writeTSConfigJson: () => undefined,
};

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  getFileExtension: () => FileExtension.TS,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
};

let service: any;
function init(): void {
  service = new JestService(npmService, typeScriptService, utilsService);
}

describe('JestService()', () => {
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
      service.createIndexSpecFile = () => undefined;
      service.createJestConfig = () => undefined;
      service.installPackages = () => undefined;
      service.updatePackageJson = () => undefined;
      service.updateTSConfigJson = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });

    it('calls utilsService.getFileExtension()', () => {
      service.utilsService.getFileExtension = () => FileExtension.TS;
      const spy = spyOn(service.utilsService, 'getFileExtension').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls updatePackageJson()', () => {
      service.utilsService.getFileExtension = () => FileExtension.TS;
      const spy = spyOn(service, 'updatePackageJson').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls installPackages() with false when !isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.TS;
      const spy = spyOn(service, 'installPackages').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('calls installPackages() with true when isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.JS;
      const spy = spyOn(service, 'installPackages').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('calls createJestConfig() with false and .ts when !isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.TS;
      const spy = spyOn(service, 'createJestConfig').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith(false, FileExtension.TS);
    });

    it('calls createJestConfig() with true and .js when isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.JS;
      const spy = spyOn(service, 'createJestConfig').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith(true, FileExtension.JS);
    });

    it('calls updateTSConfigJson() when !isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.TS;
      const spy = spyOn(service, 'updateTSConfigJson').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('does not call updateTSConfigJson() when isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.JS;
      const spy = spyOn(service, 'updateTSConfigJson').and.callThrough();
      service.init();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls createIndexSpecFile() with .ts when !isVanillaJs', () => {
      const spy = spyOn(service, 'createIndexSpecFile').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls createIndexSpecFile() with .js when isVanillaJs', () => {
      service.utilsService.getFileExtension = () => FileExtension.JS;
      const spy = spyOn(service, 'createIndexSpecFile').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updatePackageJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.updatePackageJson).toEqual('function');
    });

    it('calls npmService.getPackageJson()', () => {
      const spy = spyOn(service.npmService, 'getPackageJson').and.callThrough();
      service.updatePackageJson();
      expect(spy).toHaveBeenCalled();
    });

    it('calls npmService.writePackageJson() with package.json object', () => {
      const expected = {
        scripts: {
          test: 'jest',
          'test:cov': 'jest --coverage',
        },
      };
      const spy = spyOn(service.npmService, 'writePackageJson').and.callThrough();
      service.updatePackageJson();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('installPackages()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.installPackages).toEqual('function');
    });

    it('calls npmService.installPackages() with jest if isVanillaJs', () => {
      const expected = ['jest', 'jest-cli'];
      const spy = spyOn(service.npmService, 'installPackages').and.callThrough();
      service.installPackages(true);
      expect(spy).toHaveBeenCalledWith(expected, NpmDependencyType.DEV_DEPENDENCY);
    });

    it('calls npmService.installPackages() with ts-jest if !isVanillaJs', () => {
      const expected = ['jest', 'jest-cli', 'ts-jest', '@types/jest'];
      const spy = spyOn(service.npmService, 'installPackages').and.callThrough();
      service.installPackages(false);
      expect(spy).toHaveBeenCalledWith(expected, NpmDependencyType.DEV_DEPENDENCY);
    });
  });

  describe('createJestConfig()', () => {
    beforeEach(() => {
      init();
      service.writeJestConfig = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.createJestConfig).toEqual('function');
    });

    it('calls writeJestConfig() with no preset and .js when isVanillaJs', () => {
      const config = {
        collectCoverageFrom: [
          `<rootDir>/src/**/*.${FileExtension.JS}`,
          `!<rootDir>/src/**/index.${FileExtension.JS}`,
        ],
        coverageDirectory: 'coverage',
        coverageReporters: ['lcov', 'text-summary'],
        preset: '',
        testEnvironment: 'node',
        testPathIgnorePatterns: [
          '<rootDir>/coverage/',
          '<rootDir>/design/',
          '<rootDir>/dist/',
          '<rootDir>/docs/',
          '<rootDir>/node_modules/',
        ],
      };
      const spy = spyOn(service, 'writeJestConfig').and.callThrough();
      service.createJestConfig(true, FileExtension.JS);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls writeJestConfig() with ts-jest preset and .ts when !isVanillaJs', () => {
      const config = {
        collectCoverageFrom: [
          `<rootDir>/src/**/*.${FileExtension.TS}`,
          `!<rootDir>/src/**/index.${FileExtension.TS}`,
        ],
        coverageDirectory: 'coverage',
        coverageReporters: ['lcov', 'text-summary'],
        preset: 'ts-jest',
        testEnvironment: 'node',
        testPathIgnorePatterns: [
          '<rootDir>/coverage/',
          '<rootDir>/design/',
          '<rootDir>/dist/',
          '<rootDir>/docs/',
          '<rootDir>/node_modules/',
        ],
      };
      const spy = spyOn(service, 'writeJestConfig').and.callThrough();
      service.createJestConfig(false, FileExtension.TS);
      expect(spy).toHaveBeenCalledWith(config);
    });
  });

  describe('writeJestConfig()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writeJestConfig).toEqual('function');
    });

    it('calls utilsService.writeFile() with the jest config filename and contents', () => {
      const json = { test: 'json' };
      const expected = `module.exports = ${JSON.stringify(json, null, 2)}`;
      const spy = spyOn(service.utilsService, 'writeFile').and.callThrough();
      service.writeJestConfig(json);
      expect(spy).toHaveBeenCalledWith(service.jestConfigFile, expected);
    });
  });

  describe('updateTSConfigJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.updateTSConfigJson).toEqual('function');
    });

    it('calls typeScriptService.getTSConfigJson()', () => {
      const spy = spyOn(service.typeScriptService, 'getTSConfigJson').and.callThrough();
      service.updateTSConfigJson();
      expect(spy).toHaveBeenCalled();
    });

    it('calls typeScriptService.writeTSConfigJson()', () => {
      const expected = { compilerOptions: { types: ['jest'] } };
      const spy = spyOn(service.typeScriptService, 'writeTSConfigJson').and.callThrough();
      service.updateTSConfigJson();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('createIndexSpecFile()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.createIndexSpecFile).toEqual('function');
    });

    it('calls utilsService.resolve() to get the src folder', () => {
      const spy = spyOn(service.utilsService, 'resolve').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexSpecFile(fileExtension);
      expect(spy).toHaveBeenCalledWith(['src']);
    });

    it('calls utilsService.createDirectoryIfNotExists()', () => {
      const spy = spyOn(service.utilsService, 'createDirectoryIfNotExists').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexSpecFile(fileExtension);
      expect(spy).toHaveBeenCalledWith('src');
    });

    it('calls utilsService.resolve() to get the index file', () => {
      const spy = spyOn(service.utilsService, 'resolve').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexSpecFile(fileExtension);
      expect(spy).toHaveBeenCalledWith(['src', `index.spec.${fileExtension}`]);
    });

    it('calls utilsService.writeFile() with index file and contents', () => {
      const spy = spyOn(service.utilsService, 'writeFile').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexSpecFile(fileExtension);
      expect(spy).toHaveBeenCalledWith(
        `src/index.spec.${fileExtension}`,
        "console.log('new npm project')"
      );
    });
  });
});
