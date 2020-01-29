import { FileExtension, NpmDependencyType } from '../../enums';
import { NpmService } from '../npm';
import { TypeScriptService } from '../typescript';
import { UtilsService } from '../utils';

export class PrettierService {
  public prettierConfigFile = this.utilsService.resolve(['.prettierrc']);

  constructor(
    private npmService: NpmService,
    private typeScriptService: TypeScriptService,
    private utilsService: UtilsService
  ) {}

  init(args: string[]): void {
    const isVanillaJs = this.utilsService.getFileExtension(args) === FileExtension.JS;
    this.installPackages(isVanillaJs);
    this.createPrettierConfig();
    if (!isVanillaJs) {
      this.updateTSLintJson();
    }
  }

  installPackages(isVanillaJs: boolean): void {
    let packages = ['prettier'];
    if (!isVanillaJs) {
      packages = packages.concat(['tslint-config-prettier', 'tslint-plugin-prettier']);
    }
    this.npmService.installPackages(packages, NpmDependencyType.DEV_DEPENDENCY);
  }

  createPrettierConfig(): void {
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
    this.writePrettierConfig(config);
  }

  writePrettierConfig(json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.utilsService.writeFile(this.prettierConfigFile, str);
  }

  updateTSLintJson(): void {
    const tslint = this.typeScriptService.getTSLintJson();
    if (tslint != null) {
      tslint.extends.push('tslint-config-prettier');
      tslint.extends.push('tslint-plugin-prettier');
      tslint.rules.prettier = true;
      this.typeScriptService.writeTSLintJson(tslint);
    }
  }
}
