import { ModelGenerator } from './model-generator';

const utils: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
};

let generator: any;
let consoleLogSpy: any;
function init() {
  generator = new ModelGenerator(utils);
  consoleLogSpy = spyOn(console, 'log').and.returnValue(null);
}

describe('ModelGenerator()', () => {
  const testConfig = { name: 'test-model' };

  describe('createModels()', () => {
    beforeEach(() => {
      init();
      generator.createModelConfig = () => testConfig;
      generator.createNewModel = () => undefined;
    });

    it('is a function', () => {
      expect(typeof generator.createModels).toEqual('function');
    });

    it('calls createModelConfig() with the model name and ts file extension', () => {
      const spy = spyOn(generator, 'createModelConfig').and.callThrough();
      const cliOptions = { create: ['test-model'], vanillaJavascript: false };
      generator.createModels(cliOptions);
      expect(spy).toHaveBeenCalledWith('test-model', 'ts');
    });

    it('calls createModelConfig() with the model name and js file extension', () => {
      const spy = spyOn(generator, 'createModelConfig').and.callThrough();
      const cliOptions = { create: ['test-model'], vanillaJavascript: true };
      generator.createModels(cliOptions);
      expect(spy).toHaveBeenCalledWith('test-model', 'js');
    });

    it('calls createNewModel()', () => {
      const spy = spyOn(generator, 'createNewModel').and.callThrough();
      const cliOptions = { create: ['test-model'], vanillaJavascript: true };
      generator.createModels(cliOptions);
      expect(spy).toHaveBeenCalledWith(testConfig);
    });
  });

  describe('createModelConfig()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createModelConfig).toEqual('function');
    });

    it('creates the model config for ts file', () => {
      const expected = {
        camel: 'testModel',
        file: 'models/test-model/test-model.model.ts',
        fileExt: 'ts',
        folder: 'models/test-model',
        index: 'models/test-model/index.ts',
        kabob: 'test-model',
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
        name: 'test-model',
        pascal: 'TestModel',
        spec: 'models/test-model/test-model.model.spec.ts',
      };
      const result = generator.createModelConfig('test-model', 'ts');
      expect(result).toEqual(expected);
    });

    it('creates the model config for js file', () => {
      const expected = {
        camel: 'testModel',
        file: 'models/test-model/test-model.model.js',
        fileExt: 'js',
        folder: 'models/test-model',
        index: 'models/test-model/index.js',
        kabob: 'test-model',
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.js',
        name: 'test-model',
        pascal: 'TestModel',
        spec: 'models/test-model/test-model.model.spec.js',
      };
      const result = generator.createModelConfig('test-model', 'js');
      expect(result).toEqual(expected);
    });
  });

  describe('createNewModel()', () => {
    beforeEach(() => {
      init();
      generator.createModelsIndexIfNotExists = () => undefined;
      generator.createJSModel = () => undefined;
      generator.createTSModel = () => undefined;
      generator.createModelSpec = () => undefined;
      generator.createModelIndex = () => undefined;
      generator.updateModelsIndex = () => undefined;
    });

    it('is a function', () => {
      expect(typeof generator.createNewModel).toEqual('function');
    });

    it('calls utils.createDirectoryIfNotExists()', () => {
      const spy = spyOn(generator.utils, 'createDirectoryIfNotExists').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config.folder);
    });

    it('calls createModelsIndexIfNotExists()', () => {
      const spy = spyOn(generator, 'createModelsIndexIfNotExists').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createJSModel() when the fileExt is js', () => {
      const spy = spyOn(generator, 'createJSModel').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'js',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createTSModel() when the fileExt is ts', () => {
      const spy = spyOn(generator, 'createTSModel').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createModelSpec()', () => {
      const spy = spyOn(generator, 'createModelSpec').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createModelIndex()', () => {
      const spy = spyOn(generator, 'createModelIndex').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls updateModelsIndex()', () => {
      const spy = spyOn(generator, 'updateModelsIndex').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: 'ts',
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });
  });

  describe('createJSModel()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createJSModel).toEqual('function');
    });

    it('calls utils.writeFile()', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const config = {
        file: 'models/test-model/test-model.model.ts',
        pascal: 'TestModel',
      };
      const expectedText = `import { getObject, getString } from '@lernato/common';

export class TestModel {
  constructor(o) {
    const obj = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
      generator.createJSModel(config);
      expect(spy).toHaveBeenCalledWith(config.file, expectedText);
    });
  });

  describe('createTSModel()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createTSModel).toEqual('function');
    });

    it('calls utils.writeFile()', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const config = {
        file: 'models/test-model/test-model.model.ts',
        pascal: 'TestModel',
      };
      const expectedText = `import { getObject, getString } from '@lernato/common';

export class TestModel {
  public value: string;

  constructor(o?: Partial<TestModel>) {
    const obj: Partial<TestModel> = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
      generator.createTSModel(config);
      expect(spy).toHaveBeenCalledWith(config.file, expectedText);
    });
  });

  describe('createModelSpec()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createModelSpec).toEqual('function');
    });

    it('calls utils.writeFile()', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const config = {
        kabob: 'test-model',
        pascal: 'TestModel',
        spec: 'models/test-model/test-model.model.spec.ts',
      };
      const expectedText = `import { DEFAULT_STRING } from '@lernato/common';
import { TestModel } from './test-model.model';

describe('TestModel', () => {
  describe('constructor defaults', () => {
    const defaults = {
      value: DEFAULT_STRING,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new TestModel()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestModel()));
    });

    it('should set the default values when given null', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestModel(null)));
    });

    it('should set the default values when given an empty object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestModel({})));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        value: 'test value',
      };

      expect(Object.values(test)).toEqual(Object.values(new TestModel(test)));
    });
  });
});
`;
      generator.createModelSpec(config);
      expect(spy).toHaveBeenCalledWith(config.spec, expectedText);
    });
  });

  describe('createModelIndex()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createModelIndex).toEqual('function');
    });

    it('calls utils.writeFile()', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const config = {
        index: 'models/test-model/index.ts',
        kabob: 'test-model',
      };
      const expectedText = `export * from './${config.kabob}.model';
`;
      generator.createModelIndex(config);
      expect(spy).toHaveBeenCalledWith(config.index, expectedText);
    });
  });

  describe('updateModelsIndex()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.updateModelsIndex).toEqual('function');
    });

    it('calls utils.writeFile() with the model export added', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const fileText = `export * from './a-model';
export * from './z-model';
`;
      generator.utils.readFile = () => fileText;
      const config = {
        modelsIndexFile: 'models/index.ts',
        kabob: 'test-model',
      };
      const expectedText = `export * from './a-model';
export * from './test-model';
export * from './z-model';
`;
      generator.updateModelsIndex(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile, expectedText);
    });

    it('does not add the export if it already exists', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const fileText = `export * from './test-model';
export * from './a-model';
export * from './z-model';
`;
      generator.utils.readFile = () => fileText;
      const config = {
        modelsIndexFile: 'models/index.ts',
        kabob: 'test-model',
      };
      const expectedText = `export * from './a-model';
export * from './test-model';
export * from './z-model';
`;
      generator.updateModelsIndex(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile, expectedText);
    });
  });

  describe('createModelsIndexIfNotExists()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createModelsIndexIfNotExists).toEqual('function');
    });

    it('calls utils.pathExists()', () => {
      const spy = spyOn(generator.utils, 'pathExists').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile);
    });

    it('calls utils.createDirectory()', () => {
      const spy = spyOn(generator.utils, 'createDirectory').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsFolder);
    });

    it('calls utils.writeFile()', () => {
      const spy = spyOn(generator.utils, 'writeFile').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile, '');
    });
  });
});
