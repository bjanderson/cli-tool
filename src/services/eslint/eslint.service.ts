import { getObject } from '@bj.anderson/utils';
import { UtilsService } from '../utils';
import { NpmService } from '../npm';
import { NpmDependencyType, FileExtension } from '../../enums';

export class EslintService {
  public eslintrcFile = this.utilsService.resolve(['.eslintrc.json']);
  public eslintTsconfigFile = this.utilsService.resolve(['tsconfig.eslint.json']);

  constructor(private npmService: NpmService, private utilsService: UtilsService) {}

  init(args: string[]): void {
    const i = args.findIndex((arg) => arg === '-n' || arg === '--nodejs');
    const isNodejs = i > -1;
    const fileExtension = this.utilsService.getFileExtension(args);
    const isVanillaJs = fileExtension === FileExtension.JS;
    this.updatePackageJson();
    this.createEslintrc(isVanillaJs, isNodejs);
    if (!isVanillaJs) {
      this.createEslintTsconfigJson();
    }
  }

  updatePackageJson(): void {
    const json = this.npmService.getPackageJson();
    json.scripts = getObject(json.scripts);
    json.scripts.lint = 'eslint ./src --ext .js,.ts';
    this.npmService.writePackageJson(json);
    this.installPackages();
  }

  installPackages(): void {
    const packages = [
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/eslint-plugin-tslint',
      '@typescript-eslint/parser',
      'eslint',
      'eslint-config-airbnb',
      'eslint-config-prettier',
      'eslint-import-resolver-typescript',
      'eslint-plugin-import',
      'eslint-plugin-jsdoc',
      'eslint-plugin-json',
      'eslint-plugin-prettier',
    ];
    this.npmService.installPackages(packages, NpmDependencyType.DEV_DEPENDENCY);
  }

  hasEslintFile(): boolean {
    return this.utilsService.pathExists(this.eslintrcFile);
  }

  hasEslintTsconfigFile(): boolean {
    return this.utilsService.pathExists(this.eslintTsconfigFile);
  }

  createEslintrc(isVanillaJs: boolean, isNodejs: boolean): void {
    const env = {
      browser: !isNodejs,
      es6: true,
      node: true,
      jasmine: true,
      jest: true,
    };

    let extendsValue = ['airbnb/base', 'prettier'];

    if (!isVanillaJs) {
      extendsValue = extendsValue.concat([
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
      ]);
    }

    const parser = isVanillaJs ? '' : '@typescript-eslint/parser';

    let parserOptions: any = {
      project: 'tsconfig.eslint.json',
      sourceType: 'module',
    };

    if (isVanillaJs) {
      parserOptions = {};
    }

    let plugins = ['jsdoc', 'prettier'];

    if (!isVanillaJs) {
      plugins = plugins.concat(['@typescript-eslint', '@typescript-eslint/tslint']);
    }

    const settings: any = {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json'],
        },
      },
    };

    if (!isVanillaJs) {
      settings['import/parsers'] = {
        '@typescript-eslint/parser': ['.ts'],
      };
      settings['import/resolver'].node.extensions.push('.ts');
      settings['import/resolver'].typescript = {};
    }

    let rules = this.getRules();

    if (!isVanillaJs) {
      rules = { ...rules, ...this.getTSRules() };
    }

    const json = {
      env,
      extends: extendsValue,
      parser,
      parserOptions,
      plugins,
      settings,
      rules,
    };
    this.writeEslintrc(json);
  }

  getRules(): any {
    return {
      // ESLINT
      'arrow-body-style': 'warn',
      'arrow-parens': ['warn', 'always'],
      camelcase: 'warn',
      'class-methods-use-this': 'off',
      'comma-dangle': 'off',
      complexity: 'off',
      'constructor-super': 'warn',
      curly: ['warn', 'multi-line'],
      'dot-notation': 'warn',
      'eol-last': 'off',
      eqeqeq: ['warn', 'smart'],
      'guard-for-in': 'warn',
      'id-blacklist': 'warn',
      'id-match': 'warn',
      'linebreak-style': 'off',
      'lines-between-class-members': 'off',
      'max-classes-per-file': ['warn', 1],
      'max-len': 'off', // do this or prettier won't play nice with line length
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-bitwise': 'warn',
      'no-caller': 'warn',
      'no-cond-assign': 'warn',
      'no-console': [
        'warn',
        {
          allow: [
            'log',
            'error',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'table',
            'dirxml',
            'warn',
            'groupCollapsed',
            'Console',
            'profile',
            'profileEnd',
            'timeStamp',
            'context',
          ],
        },
      ],
      'no-debugger': 'warn',
      'no-duplicate-imports': 'warn',
      'no-empty': 'off',
      'no-eval': 'warn',
      'no-extra-semi': 'off',
      'no-fallthrough': 'warn',
      'no-invalid-this': 'off',
      'no-irregular-whitespace': 'off',
      'no-multiple-empty-lines': 'warn',
      'no-new-wrappers': 'warn',
      'no-param-reassign': 'warn',
      'no-restricted-globals': 'off',
      'no-shadow': [
        'warn',
        {
          hoist: 'all',
        },
      ],
      'no-throw-literal': 'warn',
      'no-trailing-spaces': 'off',
      'no-undef-init': 'warn',
      'no-underscore-dangle': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unused-expressions': 'warn',
      'no-unused-labels': 'warn',
      'no-useless-constructor': 'off',
      'no-var': 'warn',
      'object-shorthand': 'warn',
      'one-var': ['warn', 'never'],
      'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'quote-props': ['warn', 'as-needed'],
      radix: 'warn',
      'space-before-function-paren': 'off',
      'space-in-parens': ['off', 'never'],
      'spaced-comment': 'warn',
      'use-isnan': 'warn',
      'valid-typeof': 'off',

      // IMPORT
      'import/extensions': [
        'warn',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-deprecated': 'warn',
      'import/no-extraneous-dependencies': [1, { devDependencies: true }],
      'import/order': 'warn',
      'import/prefer-default-export': 'off',

      // JSDOC
      'jsdoc/no-types': 'warn',

      // PRETTIER
      'prettier/prettier': 'warn',
    };
  }

  getTSRules(): any {
    return {
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/class-name-casing': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-definitions': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/member-delimiter-style': [
        'off',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-misused-new': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-namespace-keyword': 'warn',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/semi': ['warn', 'always'],
      '@typescript-eslint/triple-slash-reference': 'warn',
      '@typescript-eslint/type-annotation-spacing': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      '@typescript-eslint/tslint/config': [
        'warn',
        {
          rules: {
            'jsdoc-format': true,
            'no-boolean-literal-compare': true,
            'no-reference-import': true,
          },
        },
      ],
    };
  }

  createEslintTsconfigJson(): void {
    const json = {
      extends: './tsconfig.json',
      exclude: ['coverage', 'dist', 'doc', 'design', 'node_modules'],
    };
    this.writeEslintTsconfigJson(json);
  }

  writeEslintrc(json: any): void {
    this.utilsService.writeJsonFile(this.eslintrcFile, json);
  }

  writeEslintTsconfigJson(json: any): void {
    this.utilsService.writeJsonFile(this.eslintTsconfigFile, json);
  }

  getEslintrc(): any {
    return this.utilsService.getFileAsJson(this.eslintrcFile);
  }
}
