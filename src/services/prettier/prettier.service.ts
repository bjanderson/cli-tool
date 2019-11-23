import { NpmService } from '../npm';
import { TypeScriptService } from '../typescript';

export class PrettierService {
  constructor(private npmService: NpmService, private typeScriptService: TypeScriptService) {}

  init(): void {
    this.installPackages();
    this.updateTSLintJson();
  }

  installPackages(): void {
    const packages = ['prettier', 'tslint-config-prettier', 'tslint-plugin-prettier'];
    this.npmService.installPackages(packages);
  }

  updateTSLintJson(): void {
    const tslint = this.typeScriptService.getTSLintJson();
    tslint.extends.push('tslint-config-prettier');
    tslint.extends.push('tslint-plugin-prettier');
    tslint.rules.prettier = true;
    this.typeScriptService.writeTSLintJson(tslint);
  }
}
