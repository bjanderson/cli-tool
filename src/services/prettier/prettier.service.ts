import { NpmDependencyType } from '../../enums';
import { NpmService } from '../npm';
import { UtilsService } from '../utils';

export class PrettierService {
  public prettierConfigFile = this.utilsService.resolve(['.prettierrc']);

  constructor(private npmService: NpmService, private utilsService: UtilsService) {}

  init(/* args: string[] */): void {
    this.installPackages();
    this.createPrettierConfig();
  }

  installPackages(): void {
    const packages = ['prettier'];
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
    this.utilsService.writeJsonFile(this.prettierConfigFile, json);
  }
}
