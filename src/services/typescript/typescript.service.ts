import { NpmService } from '../npm';
import { UtilsService } from '../utils';

export class TypeScriptService {
  public tsConfigJsonFile = this.utilsService.resolve(['tsconfig.json']);
  public tsLintJsonFile = this.utilsService.resolve(['tslint.json']);

  constructor(private npmService: NpmService, private utilsService: UtilsService) {}

  init(args: string[]): void {
    this.npmService.init(args);
    this.updatePackageJson();
    this.createTSConfig();
    this.createTSLintJson();
  }

  updatePackageJson(): void {
    const json = this.npmService.getPackageJson();
    json.scripts = json.scripts || {};
    json.scripts.build = 'tsc';
    json.scripts.start = 'node dist/index.js';
    json.scripts.lint = `tslint --project "."`;
    json.scripts.watch = 'npm-watch';
    json.watch = {
      build: {
        patterns: ['src'],
        extensions: 'ts',
      },
    };
    this.npmService.writePackageJson(json);
    this.installPackages();
  }

  installPackages(): void {
    const packages = ['typescript', 'ts-lint', '@types/node', 'npm-watch', 'tslint-config-airbnb'];
    this.npmService.installPackages(packages);
  }

  createTSConfig(): void {
    const tsConfig = {
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
    this.writeTSConfigJson(tsConfig);
  }

  createTSLintJson(): void {
    const tslint = {
      extends: ['tslint:recommended', 'tslint-config-airbnb'],
      rulesDirectory: [],
      rules: {
        'array-type': false,
        'arrow-parens': true,
        deprecation: {
          severity: 'warning',
        },
        'interface-name': true,
        'max-classes-per-file': [true, 1, 'exclude-class-expressions'],
        'member-access': false,
        'member-ordering': [
          true,
          {
            order: ['static-field', 'instance-field', 'static-method', 'instance-method'],
          },
        ],
        'no-consecutive-blank-lines': true,
        'no-console': [true, 'debug', 'info', 'time', 'timeEnd', 'trace'],
        'no-empty': false,
        'no-inferrable-types': [true, 'ignore-params'],
        'no-non-null-assertion': true,
        'no-redundant-jsdoc': true,
        'no-switch-case-fall-through': true,
        'no-var-requires': false,
        'object-literal-key-quotes': [true, 'as-needed'],
        'object-literal-sort-keys': false,
        'ordered-imports': [
          true,
          {
            'import-sources-order': 'case-insensitive',
            'named-imports-order': 'case-insensitive',
          },
        ],
        'no-require-imports': true,
      },
    };
    this.writeTSLintJson(tslint);
  }

  getTSConfigJson(): any {
    if (this.utilsService.pathExists(this.tsConfigJsonFile)) {
      const str = this.utilsService.readFile(this.tsConfigJsonFile);
      return JSON.parse(str);
    }
    console.warn(
      'WARNING: Could not find tsconfig.json - make sure you are in your top-level project folder'
    );
  }

  writeTSConfigJson(json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.utilsService.writeFile(this.tsConfigJsonFile, str);
  }

  getTSLintJson(): any {
    if (this.utilsService.pathExists(this.tsLintJsonFile)) {
      const str = this.utilsService.readFile(this.tsLintJsonFile);
      return JSON.parse(str);
    }
    console.warn(
      'WARNING: Could not find tslint.json - make sure you are in your top-level project folder'
    );
  }

  writeTSLintJson(json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.utilsService.writeFile(this.tsLintJsonFile, str);
  }
}
