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

  init(): void {
    this.updatePackageJson();
    this.createJestConfig();
    this.updateTSConfigJson();
  }

  updatePackageJson(): void {
    const json = this.npmService.getPackageJson();
    json.scripts = json.scripts || {};
    json.scripts.test = 'jest';
    json.scripts['test:cov'] = 'jest --coverage';

    this.npmService.writePackageJson(json);
    this.installPackages();
  }

  installPackages(): void {
    const packages = ['jest', 'ts-jest', '@types/jest'];
    this.npmService.installPackages(packages);
  }

  createJestConfig(): void {
    const config = {
      collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/index.ts'],
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
    this.writeJestConfig(config);
  }

  writeJestConfig(json: any): void {
    const str = `module.exports = ${JSON.stringify(json, null, 2)}`;
    this.utilsService.writeFile(this.jestConfigFile, str);
  }

  updateTSConfigJson(): void {
    const tsconfig = this.typeScriptService.getTSConfigJson();
    tsconfig.compilerOptions.types.push('jest');
    this.typeScriptService.writeTSConfigJson(tsconfig);
  }
}
