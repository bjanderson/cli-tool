import { FileExtension } from '../../enums';
import { ServiceService } from './service.service';
import { ServiceConfig } from '../../models';

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
  generator = new ServiceService(utilsService);
  spyOn(console, 'log').and.returnValue(null);
  spyOn(console, 'warn').and.returnValue(null);
  spyOn(console, 'error').and.returnValue(null);
}

describe('ServiceService()', () => {
  describe('createService()', () => {
    beforeEach(() => {
      init();
      generator.getServicesFolder = () => 'test/folder/';
      generator.createNewService = () => undefined;
      generator.createServiceConfig = () => 'test-service-config';
    });

    it('is a function', () => {
      expect(typeof generator.createService).toEqual('function');
    });

    it('calls console.error() if given an invalid service name', () => {
      const args = ['-test'];
      generator.createService(args);
      expect(console.error).toHaveBeenCalledWith('Invalid service name');
    });

    it('calls utilsService.exit() if given an invalid service name', () => {
      const spy = spyOn(generator.utilsService, 'exit').and.callThrough();
      const args = ['-test'];
      generator.createService(args);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('calls utilsService.getFileExtension()', () => {
      const spy = spyOn(generator.utilsService, 'getFileExtension').and.callThrough();
      const args = ['test'];
      generator.createService(args);
      expect(spy).toHaveBeenCalledWith(args);
    });

    it('calls getServicesFolder()', () => {
      const spy = spyOn(generator, 'getServicesFolder').and.callThrough();
      const args = ['test'];
      generator.createService(args);
      expect(spy).toHaveBeenCalledWith(args);
    });

    it('calls createServiceConfig()', () => {
      const spy = spyOn(generator, 'createServiceConfig').and.callThrough();
      const args = ['test'];
      generator.createService(args);
      expect(spy).toHaveBeenCalledWith('test', FileExtension.TS, 'test/folder/');
    });

    it('calls createNewService()', () => {
      const spy = spyOn(generator, 'createNewService').and.callThrough();
      const args = ['test'];
      generator.createService(args);
      expect(spy).toHaveBeenCalledWith('test-service-config');
    });
  });

  describe('getServicesFolder()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.getServicesFolder).toEqual('function');
    });

    it('returns the default services folder', () => {
      const args = ['test'];
      const result: any = generator.getServicesFolder(args);
      expect(result).toEqual(ServiceConfig.defaultServicesFolder);
    });

    it('returns the given services folder (-f)', () => {
      const args = ['test', '-f', 'test-folder'];
      const result: any = generator.getServicesFolder(args);
      expect(result).toEqual('test-folder');
    });

    it('returns the given services folder (--services-folder)', () => {
      const args = ['test', '--services-folder', 'test-folder'];
      const result: any = generator.getServicesFolder(args);
      expect(result).toEqual('test-folder');
    });
  });

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
        fileExt: FileExtension.TS,
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
        fileExt: FileExtension.JS,
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
      generator.createJSServiceSpec = () => undefined;
      generator.createTSServiceSpec = () => undefined;
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
        fileExt: FileExtension.TS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config.folder);
    });

    it('calls createServicesIndexIfNotExists()', () => {
      const spy = spyOn(generator, 'createServicesIndexIfNotExists').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.TS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createJSService() when the fileExt is js', () => {
      const spy = spyOn(generator, 'createJSService').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.JS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createTSService() when the fileExt is ts', () => {
      const spy = spyOn(generator, 'createTSService').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.TS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createJSServiceSpec()', () => {
      const spy = spyOn(generator, 'createJSServiceSpec').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.JS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createTSServiceSpec()', () => {
      const spy = spyOn(generator, 'createTSServiceSpec').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.TS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls createServiceIndex()', () => {
      const spy = spyOn(generator, 'createServiceIndex').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.TS,
      };
      generator.createNewService(config);
      expect(spy).toHaveBeenCalledWith(config);
    });

    it('calls updateServicesIndex()', () => {
      const spy = spyOn(generator, 'updateServicesIndex').and.callThrough();
      const config = {
        folder: 'test-service',
        fileExt: FileExtension.TS,
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
      const expectedText = `export class TestServiceService {
  constructor() {}
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
      const expectedText = `export class TestServiceService {
  constructor() {}
}
`;
      generator.createTSService(config);
      expect(spy).toHaveBeenCalledWith(config.file, expectedText);
    });
  });

  describe('createJSServiceSpec()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createJSServiceSpec).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        kabob: 'test-service',
        pascal: 'TestService',
        spec: 'services/test-service/test-service.service.spec.ts',
      };
      const expectedText = `import { TestServiceService } from './test-service.service';

let service;
function init(): void {
  service = new TestServiceService();
}

describe('TestServiceService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
`;
      generator.createJSServiceSpec(config);
      expect(spy).toHaveBeenCalledWith(config.spec, expectedText);
    });
  });

  describe('createTSServiceSpec()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof generator.createTSServiceSpec).toEqual('function');
    });

    it('calls utilsService.writeFile()', () => {
      const spy = spyOn(generator.utilsService, 'writeFile').and.callThrough();
      const config = {
        kabob: 'test-service',
        pascal: 'TestService',
        spec: 'services/test-service/test-service.service.spec.ts',
      };
      const expectedText = `import { TestServiceService } from './test-service.service';

let service: any;
function init(): void {
  service = new TestServiceService();
}

describe('TestServiceService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
`;
      generator.createTSServiceSpec(config);
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
