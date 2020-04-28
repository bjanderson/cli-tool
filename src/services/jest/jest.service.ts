import { getObject } from '@bj.anderson/utils';
import { FileExtension, NpmDependencyType } from '../../enums';
import { NpmService } from '../npm';
import { TypeScriptService } from '../typescript';
import { UtilsService } from '../utils';

export class JestService {
  public jestConfigFile = this.utilsService.resolve(['jest.config.js']);

  constructor(
    private npmService: NpmService,
    private typeScriptService: TypeScriptService,
    private utilsService: UtilsService
  ) {}

  init(args: string[]): void {
    const fileExtension = this.utilsService.getFileExtension(args);
    const isVanillaJs = fileExtension === FileExtension.JS;
    this.updatePackageJson();
    this.installPackages(isVanillaJs);
    this.createJestConfig(isVanillaJs, fileExtension);
    if (!isVanillaJs) {
      this.updateTSConfigJson();
    }
    this.createIndexSpecFile(fileExtension);
  }

  updatePackageJson(): void {
    const json = this.npmService.getPackageJson();
    json.scripts = getObject(json.scripts);
    json.scripts.test = 'jest';
    json.scripts['test:cov'] = 'jest --coverage';

    this.npmService.writePackageJson(json);
  }

  installPackages(isVanillaJs: boolean): void {
    let packages = ['jest', 'jest-cli'];
    if (!isVanillaJs) {
      packages = packages.concat(['ts-jest', '@types/jest']);
    }
    this.npmService.installPackages(packages, NpmDependencyType.DEV_DEPENDENCY);
  }

  createJestConfig(isVanillaJs: boolean, fileExt: FileExtension): void {
    const config = {
      collectCoverageFrom: [`<rootDir>/src/**/*.${fileExt}`, `!<rootDir>/src/**/index.${fileExt}`],
      coverageDirectory: 'coverage',
      coverageReporters: ['lcov', 'text-summary'],
      preset: isVanillaJs ? '' : 'ts-jest',
      testEnvironment: 'node',
      testPathIgnorePatterns: [
        '<rootDir>/coverage/',
        '<rootDir>/design/',
        '<rootDir>/dist/',
        '<rootDir>/docs/',
        '<rootDir>/node_modules/',
      ],
    };
    this.writeJestConfig(config);
  }

  writeJestConfig(json: any): void {
    const str = `module.exports = ${JSON.stringify(json, null, 2)}`;
    this.utilsService.writeFile(this.jestConfigFile, str);
  }

  updateTSConfigJson(): void {
    const tsconfig = this.typeScriptService.getTSConfigJson();
    if (tsconfig != null) {
      tsconfig.compilerOptions.types.push('jest');
      this.typeScriptService.writeTSConfigJson(tsconfig);
    }
  }

  createIndexSpecFile(fileExt: string): void {
    const src = this.utilsService.resolve(['src']);
    this.utilsService.createDirectoryIfNotExists(src);
    const indexSpec = this.utilsService.resolve(['src', `index.spec.${fileExt}`]);
    this.utilsService.writeFile(indexSpec, `console.log('new npm project')`);
  }
}
