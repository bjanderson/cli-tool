import { FileExtension } from '../../enums';
import { ModelService } from './model.service';
import { ModelConfig } from '../../models';

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  exit: () => undefined,
  getFileExtension: () => FileExtension.TS,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
};

let generator: any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function init(): void {
  generator = new ModelService(utilsService);
  spyOn(console, 'log').and.returnValue(null);
  spyOn(console, 'warn').and.returnValue(null);
  spyOn(console, 'error').and.returnValue(null);
}

describe('ModelService()', () => {
  describe('createModel()', () => {
    beforeEach(() => {
      init();
      generator.getModelsFolder = () => 'test/folder/';
      generator.createNewModel = () => undefined;
      generator.createModelConfig = () => 'test-model-config';
    });

    it('is a function', () => {
      expect(typeof generator.createModel).toEqual('function');
    });

    it('calls console.error() if given an invalid model name', () => {
      const args = ['-test'];
      generator.createModel(args);
      expect(console.error).toHaveBeenCalledWith('Invalid model name');
    });

    it('calls utilsService.exit() if given an invalid model name', () => {
      const spy = spyOn(generator.utilsService, 'exit').and.callThrough();
      const args = ['-test'];
      generator.createModel(args);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('calls utilsService.getFileExtension()', () => {
      const spy = spyOn(generator.utilsService, 'getFileExtension').and.callThrough();
      const args = ['test'];
      generator.createModel(args);
      expect(spy).toHaveBeenCalledWith(args);
    });

    it('calls getModelsFolder()', () => {
      const spy = spyOn(generator, 'getModelsFolder').and.callThrough();
      const args = ['test'];
      generator.createModel(args);
      expect(spy).toHaveBeenCalledWith(args);
    });

    it('calls createModelConfig()', () => {
      const spy = spyOn(generator, 'createModelConfig').and.callThrough();
      const args = ['test'];
      generator.createModel(args);
      expect(spy).toHaveBeenCalledWith('test', FileExtension.TS, 'test/folder/');
    });

    it('calls createNewModel()', () => {
      const spy = spyOn(generator, 'createNewModel').and.callThrough();
      const args = ['test'];
      generator.createModel(args);
      expect(spy).toHaveBeenCalledWith('test-model-config');
    });
  });

  describe('getModelsFolder()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.getModelsFolder).toEqual('function');
    });

    it('returns the default models folder', () => {
      const args = ['test'];
      const result: any = generator.getModelsFolder(args);
      expect(result).toEqual(ModelConfig.defaultModelsFolder);
    });

    it('returns the given models folder (-f)', () => {
      const args = ['test', '-f', 'test-folder'];
      const result: any = generator.getModelsFolder(args);
      expect(result).toEqual('test-folder');
    });

    it('returns the given models folder (--models-folder)', () => {
      const args = ['test', '--models-folder', 'test-folder'];
      const result: any = generator.getModelsFolder(args);
      expect(result).toEqual('test-folder');
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
        file: 'src/models/test-model/test-model.model.ts',
        fileExt: FileExtension.TS,
        folder: 'src/models/test-model',
        index: 'src/models/test-model/index.ts',
        kabob: 'test-model',
        modelsFolder: 'src/models',
        modelsIndexFile: 'src/models/index.ts',
        name: 'test-model',
        pascal: 'TestModel',
        spec: 'src/models/test-model/test-model.model.spec.ts',
      };
      const result = generator.createModelConfig('test-model', 'ts', 'src/models');
      expect(result).toEqual(expected);
    });

    it('creates the model config for js file', () => {
      const expected = {
        camel: 'testModel',
        file: 'src/models/test-model/test-model.model.js',
        fileExt: FileExtension.JS,
        folder: 'src/models/test-model',
        index: 'src/models/test-model/index.js',
        kabob: 'test-model',
        modelsFolder: 'src/models',
        modelsIndexFile: 'src/models/index.js',
        name: 'test-model',
        pascal: 'TestModel',
        spec: 'src/models/test-model/test-model.model.spec.js',
      };
      const result = generator.createModelConfig('test-model', 'js', 'src/models');
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

    it('calls utilsService.createDirectoryIfNotExists()', () => {
      const spy = spyOn(generator.utilsService, 'createDirectoryIfNotExists').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config.folder);
    });

    it('calls createModelsIndexIfNotExists()', () => {
      const spy = spyOn(generator, 'createModelsIndexIfNotExists').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createJSModel() when the fileExt is js', () => {
      const spy = spyOn(generator, 'createJSModel').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.JS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createTSModel() when the fileExt is ts', () => {
      const spy = spyOn(generator, 'createTSModel').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createModelSpec()', () => {
      const spy = spyOn(generator, 'createModelSpec').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createModelIndex()', () => {
      const spy = spyOn(generator, 'createModelIndex').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
      };
      generator.createNewModel(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls updateModelsIndex()', () => {
      const spy = spyOn(generator, 'updateModelsIndex').and.callThrough();
      const config = {
        folder: 'test-model',
        fileExt: FileExtension.TS,
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

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        file: 'models/test-model/test-model.model.ts',
        pascal: 'TestModel',
      };
      const expectedText = `import { getObject, getString } from '@bj.anderson/utils';

export class TestModel {
  constructor(o) {
    const obj = getObject(o);
    this.id = getString(obj.id);
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

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        file: 'models/test-model/test-model.model.ts',
        pascal: 'TestModel',
      };
      const expectedText = `import { getObject, getString } from '@bj.anderson/utils';

export class TestModel {
  id: string;

  constructor(o?: Partial<TestModel>) {
    const obj: Partial<TestModel> = getObject(o);
    this.id = getString(obj.id);
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

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        kabob: 'test-model',
        pascal: 'TestModel',
        spec: 'models/test-model/test-model.model.spec.ts',
      };
      const expectedText = `import { DEFAULT_STRING } from '@bj.anderson/utils';
import { TestModel } from './test-model.model';

describe('TestModel', () => {
  describe('constructor defaults', () => {
    const defaults = {
      id: DEFAULT_STRING,
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
        id: 'test id',
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

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
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

    it('calls utilsService.writeFile() with the model export added', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const fileText = `export * from './a-model';
export * from './z-model';
`;
      generator.utilsService.readFile = () => fileText;
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
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const fileText = `export * from './test-model';
export * from './a-model';
export * from './z-model';
`;
      generator.utilsService.readFile = () => fileText;
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

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(generator.utilsService, 'pathExists').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile);
    });

    it('calls utilsService.createDirectory()', () => {
      const spy = spyOn(generator.utilsService, 'createDirectory').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsFolder);
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        modelsFolder: 'models',
        modelsIndexFile: 'models/index.ts',
      };
      generator.createModelsIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.modelsIndexFile, '');
    });
  });
});
