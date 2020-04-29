import { EslintService } from './eslint.service';
import { FileExtension, NpmDependencyType } from '../../enums';

const npmService: any = {
  getPackageJson: () => ({}),
  installPackages: () => undefined,
  writePackageJson: () => undefined,
};

const utilsService: any = {
  getFileExtension: () => FileExtension.TS,
  getFileAsJson: () => {},
  pathExists: () => true,
  resolve: () => '',
  writeJsonFile: () => undefined,
};

let service: any;
function init(): void {
  service = new EslintService(npmService, utilsService);
}

describe('EslintService', () => {
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
      service.createEslintrc = () => undefined;
      service.createEslintTsconfigJson = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });

    it('calls utilsService.getFileExtension()', () => {
      const spy = spyOn(service.utilsService, 'getFileExtension').and.callThrough();
      const args = [];
      service.init(args);
      expect(spy).toHaveBeenCalled();
    });

    it('calls updatePackageJson()', () => {
      const spy = spyOn(service, 'updatePackageJson').and.callThrough();
      const args = [];
      service.init(args);
      expect(spy).toHaveBeenCalled();
    });

    it('calls createEslintrc() with isNodeJs === true (-n)', () => {
      const spy = spyOn(service, 'createEslintrc').and.callThrough();
      const args = ['-n'];
      service.init(args);
      expect(spy).toHaveBeenCalledWith(false, true);
    });

    it('calls createEslintrc() with isNodeJs === true (--nodejs)', () => {
      const spy = spyOn(service, 'createEslintrc').and.callThrough();
      const args = ['--nodejs'];
      service.init(args);
      expect(spy).toHaveBeenCalledWith(false, true);
    });

    it('calls createEslintTsconfigJson()', () => {
      const spy = spyOn(service, 'createEslintTsconfigJson').and.callThrough();
      const args = [];
      service.init(args);
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
      const expected = {
        scripts: {
          lint: 'eslint ./src --ext .js,.ts',
        },
      };
      const spy = spyOn(service.npmService, 'writePackageJson').and.callThrough();
      service.updatePackageJson();
      expect(spy).toHaveBeenCalledWith(expected);
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

    it('calls npmService.installPackages() with !isVanillaJs', () => {
      const packages = [
        'eslint',
        'eslint-config-airbnb',
        'eslint-config-prettier',
        'eslint-import-resolver-typescript',
        'eslint-plugin-import',
        'eslint-plugin-jsdoc',
        'eslint-plugin-json',
        'eslint-plugin-prettier',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/eslint-plugin-tslint',
        '@typescript-eslint/parser',
        'tslint',
      ];
      const spy = spyOn(service.npmService, 'installPackages').and.callThrough();
      const isVanillaJs = false;
      service.installPackages(isVanillaJs);
      expect(spy).toHaveBeenCalledWith(packages, NpmDependencyType.DEV_DEPENDENCY);
    });

    it('calls npmService.installPackages() with isVanillaJs', () => {
      const packages = [
        'eslint',
        'eslint-config-airbnb',
        'eslint-config-prettier',
        'eslint-import-resolver-typescript',
        'eslint-plugin-import',
        'eslint-plugin-jsdoc',
        'eslint-plugin-json',
        'eslint-plugin-prettier',
      ];
      const spy = spyOn(service.npmService, 'installPackages').and.callThrough();
      const isVanillaJs = true;
      service.installPackages(isVanillaJs);
      expect(spy).toHaveBeenCalledWith(packages, NpmDependencyType.DEV_DEPENDENCY);
    });
  });

  describe('hasEslintFile()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.hasEslintFile).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(service.utilsService, 'pathExists').and.callThrough();
      service.hasEslintFile();
      expect(spy).toHaveBeenCalledWith(service.eslintrcFile);
    });
  });

  describe('hasEslintTsconfigFile()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.hasEslintTsconfigFile).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(service.utilsService, 'pathExists').and.callThrough();
      service.hasEslintTsconfigFile();
      expect(spy).toHaveBeenCalledWith(service.eslintTsconfigFile);
    });
  });

  describe('createEslintrc()', () => {
    beforeEach(() => {
      init();
      service.writeEslintrc = () => undefined;
      service.getRules = () => ({ jsRules: true });
      service.getTSRules = () => ({ tsRules: true });
    });

    it('is a function', () => {
      expect(typeof service.createEslintrc).toEqual('function');
    });

    it('calls writeEslintrc() (isVanillaJs = false; isNodejs = false)', () => {
      const expected = {
        env: {
          browser: true,
          es6: true,
          node: true,
          jasmine: true,
          jest: true,
        },
        extends: [
          'airbnb/base',
          'prettier',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
          'prettier/@typescript-eslint',
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: 'tsconfig.eslint.json',
          sourceType: 'module',
        },
        plugins: ['jsdoc', 'prettier', '@typescript-eslint', '@typescript-eslint/tslint'],
        settings: {
          'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
          },
          'import/resolver': {
            node: {
              extensions: ['.js', '.json', '.ts'],
            },
            typescript: {},
          },
        },
        rules: {
          jsRules: true,
          tsRules: true,
        },
      };
      const spy = spyOn(service, 'writeEslintrc').and.callThrough();
      const isVanillaJs = false;
      const isNodejs = false;
      service.createEslintrc(isVanillaJs, isNodejs);
      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('calls writeEslintrc() (isVanillaJs = true; isNodejs = true)', () => {
      const expected = {
        env: {
          browser: false,
          es6: true,
          node: true,
          jasmine: true,
          jest: true,
        },
        extends: ['airbnb/base', 'prettier'],
        parser: '',
        parserOptions: {},
        plugins: ['jsdoc', 'prettier'],
        settings: {
          'import/resolver': {
            node: {
              extensions: ['.js', '.json'],
            },
          },
        },
        rules: {
          jsRules: true,
        },
      };
      const spy = spyOn(service, 'writeEslintrc').and.callThrough();
      const isVanillaJs = true;
      const isNodejs = true;
      service.createEslintrc(isVanillaJs, isNodejs);
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('getRules()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getRules).toEqual('function');
    });

    it('returns the rules config', () => {
      const expected = {
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
        'max-len': 'off',
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
        'prefer-arrow-callback': [
          'warn',
          {
            allowNamedFunctions: true,
          },
        ],
        'prefer-const': 'warn',
        'prefer-template': 'warn',
        'quote-props': ['warn', 'as-needed'],
        radix: 'warn',
        'space-before-function-paren': 'off',
        'space-in-parens': ['off', 'never'],
        'spaced-comment': 'warn',
        'use-isnan': 'warn',
        'valid-typeof': 'off',
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
        'import/no-extraneous-dependencies': [
          1,
          {
            devDependencies: true,
          },
        ],
        'import/order': 'warn',
        'import/prefer-default-export': 'off',
        'jsdoc/no-types': 'warn',
        'prettier/prettier': 'warn',
      };
      const result = service.getRules();
      expect(result).toEqual(expected);
    });
  });

  describe('getTSRules()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getTSRules).toEqual('function');
    });

    it('returns the typescript rules', () => {
      const expected: any = {
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
      const result = service.getTSRules();
      expect(result).toEqual(expected);
    });
  });

  describe('createEslintTsconfigJson()', () => {
    beforeEach(() => {
      init();
      service.writeEslintTsconfigJson = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.createEslintTsconfigJson).toEqual('function');
    });

    it('calls writeEslintTsconfigJson() with the right config', () => {
      const json = {
        extends: './tsconfig.json',
        exclude: ['coverage', 'dist', 'doc', 'design', 'node_modules'],
      };
      const spy = spyOn(service, 'writeEslintTsconfigJson').and.callThrough();
      service.createEslintTsconfigJson();
      expect(spy).toHaveBeenCalledWith(json);
    });
  });

  describe('writeEslintrc()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writeEslintrc).toEqual('function');
    });

    it('calls utilsService.writeJsonFile()', () => {
      const spy = spyOn(service.utilsService, 'writeJsonFile').and.callThrough();
      const json = { test: 'json' };
      service.writeEslintrc(json);
      expect(spy).toHaveBeenCalledWith(service.eslintrcFile, json);
    });
  });

  describe('writeEslintTsconfigJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writeEslintTsconfigJson).toEqual('function');
    });

    it('calls utilsService.writeJsonFile()', () => {
      const spy = spyOn(service.utilsService, 'writeJsonFile').and.callThrough();
      const json = { test: 'json' };
      service.writeEslintTsconfigJson(json);
      expect(spy).toHaveBeenCalledWith(service.eslintTsconfigFile, json);
    });
  });

  describe('getEslintrc()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getEslintrc).toEqual('function');
    });

    it('calls utilsService.getFileAsJson()', () => {
      const spy = spyOn(service.utilsService, 'getFileAsJson').and.callThrough();
      service.getEslintrc();
      expect(spy).toHaveBeenCalledWith(service.eslintTsconfigFile);
    });
  });
});
