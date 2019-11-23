import { NpmService } from '../npm';
import { TypeScriptService } from '../typescript';

export class JestService {
  constructor(private npmService: NpmService, private typeScriptService: TypeScriptService) {}

  init(): void {
    this.updatePackageJson();
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

  updateTSConfigJson(): void {
    const tsconfig = this.typeScriptService.getTSConfigJson();
    tsconfig.compilerOptions.types.push('jest');
    this.typeScriptService.writeTSConfigJson(tsconfig);
  }
}
