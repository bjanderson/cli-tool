import { ServiceService } from './service.service';

const utilsService: any = {
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
  generator = new ServiceService(utilsService);
  consoleLogSpy = spyOn(console, 'log').and.returnValue(null);
}

describe('ServiceService()', () => {
  describe('createServiceConfig()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createServiceConfig).toEqual('function');
    });

    it('creates the service config for ts file', () => {
      const expected = {
        camel: 'testService',
        file: 'src/services/test-service/test-service.service.ts',
        fileExt: 'ts',
        folder: 'src/services/test-service',
        index: 'src/services/test-service/index.ts',
        kabob: 'test-service',
        servicesFolder: 'src/services',
        servicesIndexFile: 'src/services/index.ts',
        name: 'test-service',
        pascal: 'TestService',
        spec: 'src/services/test-service/test-service.service.spec.ts',
      };
      const result = generator.createServiceConfig('test-service', 'ts', 'src/services');
      expect(result).toEqual(expected);
    });

    it('creates the service config for js file', () => {
      const expected = {
        camel: 'testService',
        file: 'src/services/test-service/test-service.service.js',
        fileExt: 'js',
        folder: 'src/services/test-service',
        index: 'src/services/test-service/index.js',
        kabob: 'test-service',
        servicesFolder: 'src/services',
        servicesIndexFile: 'src/services/index.js',
        name: 'test-service',
        pascal: 'TestService',
        spec: 'src/services/test-service/test-service.service.spec.js',
      };
      const result = generator.createServiceConfig('test-service', 'js', 'src/services');
      expect(result).toEqual(expected);
    });
  });

  describe('createNewService()', () => {
    beforeEach(() => {
      init();
      generator.createServicesIndexIfNotExists = () => undefined;
      generator.createJSService = () => undefined;
      generator.createTSService = () => undefined;
      generator.createServiceSpec = () => undefined;
      generator.createServiceIndex = () => undefined;
      generator.updateServicesIndex = () => undefined;
    });

    it('is a function', () => {
      expect(typeof generator.createNewService).toEqual('function');
    });

    it('calls utilsService.createDirectoryIfNotExists()', () => {
      const spy = spyOn(generator.utilsService, 'createDirectoryIfNotExists').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config.folder);
    });

    it('calls createServicesIndexIfNotExists()', () => {
      const spy = spyOn(generator, 'createServicesIndexIfNotExists').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createJSService() when the fileExt is js', () => {
      const spy = spyOn(generator, 'createJSService').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'js',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createTSService() when the fileExt is ts', () => {
      const spy = spyOn(generator, 'createTSService').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createServiceSpec()', () => {
      const spy = spyOn(generator, 'createServiceSpec').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createServiceIndex()', () => {
      const spy = spyOn(generator, 'createServiceIndex').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls updateServicesIndex()', () => {
      const spy = spyOn(generator, 'updateServicesIndex').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: 'ts',
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });
  });

  describe('createJSService()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createJSService).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        file: 'services/test-service/test-service.service.ts',
        pascal: 'TestService',
      };
      const expectedText = `import { getObject, getString } from '@lernato/common';

export class TestService {
  constructor(o) {
    const obj = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
      generator.createJSService(config);
      expect(spy).toHaveBeenCalledWith(config.file, expectedText);
    });
  });

  describe('createTSService()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createTSService).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        file: 'services/test-service/test-service.service.ts',
        pascal: 'TestService',
      };
      const expectedText = `import { getObject, getString } from '@lernato/common';

export class TestService {
  value: string;

  constructor(o?: Partial<TestService>) {
    const obj: Partial<TestService> = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
      generator.createTSService(config);
      expect(spy).toHaveBeenCalledWith(config.file, expectedText);
    });
  });

  describe('createServiceSpec()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createServiceSpec).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        kabob: 'test-service',
        pascal: 'TestService',
        spec: 'services/test-service/test-service.service.spec.ts',
      };
      const expectedText = `import { DEFAULT_STRING } from '@lernato/common';
import { TestService } from './test-service.service';

describe('TestService', () => {
  describe('constructor defaults', () => {
    const defaults = {
      value: DEFAULT_STRING,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new TestService()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestService()));
    });

    it('should set the default values when given null', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestService(null)));
    });

    it('should set the default values when given an empty object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new TestService({})));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        value: 'test value',
      };

      expect(Object.values(test)).toEqual(Object.values(new TestService(test)));
    });
  });
});
`;
      generator.createServiceSpec(config);
      expect(spy).toHaveBeenCalledWith(config.spec, expectedText);
    });
  });

  describe('createServiceIndex()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createServiceIndex).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        index: 'services/test-service/index.ts',
        kabob: 'test-service',
      };
      const expectedText = `export * from './${config.kabob}.service';
`;
      generator.createServiceIndex(config);
      expect(spy).toHaveBeenCalledWith(config.index, expectedText);
    });
  });

  describe('updateServicesIndex()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.updateServicesIndex).toEqual('function');
    });

    it('calls utilsService.writeFile() with the service export added', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const fileText = `export * from './a-service';
export * from './z-service';
`;
      generator.utilsService.readFile = () => fileText;
      const config = {
        servicesIndexFile: 'services/index.ts',
        kabob: 'test-service',
      };
      const expectedText = `export * from './a-service';
export * from './test-service';
export * from './z-service';
`;
      generator.updateServicesIndex(config);
      expect(spy).toHaveBeenCalledWith(config.servicesIndexFile, expectedText);
    });

    it('does not add the export if it already exists', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const fileText = `export * from './test-service';
export * from './a-service';
export * from './z-service';
`;
      generator.utilsService.readFile = () => fileText;
      const config = {
        servicesIndexFile: 'services/index.ts',
        kabob: 'test-service',
      };
      const expectedText = `export * from './a-service';
export * from './test-service';
export * from './z-service';
`;
      generator.updateServicesIndex(config);
      expect(spy).toHaveBeenCalledWith(config.servicesIndexFile, expectedText);
    });
  });

  describe('createServicesIndexIfNotExists()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createServicesIndexIfNotExists).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(generator.utilsService, 'pathExists').and.callThrough();
      const config = {
        servicesFolder: 'services',
        servicesIndexFile: 'services/index.ts',
      };
      generator.createServicesIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.servicesIndexFile);
    });

    it('calls utilsService.createDirectory()', () => {
      const spy = spyOn(generator.utilsService, 'createDirectory').and.callThrough();
      const config = {
        servicesFolder: 'services',
        servicesIndexFile: 'services/index.ts',
      };
      generator.createServicesIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.servicesFolder);
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        servicesFolder: 'services',
        servicesIndexFile: 'services/index.ts',
      };
      generator.createServicesIndexIfNotExists(config);
      expect(spy).toHaveBeenCalledWith(config.servicesIndexFile, '');
    });
  });
});
