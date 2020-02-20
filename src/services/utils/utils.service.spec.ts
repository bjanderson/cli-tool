import { UtilsService } from './utils.service';

const staticFunctionWrapper: any = {
  execSync: () => undefined,
  existsSync: () => undefined,
  mkdirpSync: () => undefined,
  process: { exit: () => undefined },
  readFileSync: () => 'test file contents',
  resolve: () => undefined,
  writeFileSync: () => undefined,
};

let service: any;
let consoleErrorSpy: any;
function init(): void {
  service = new UtilsService(staticFunctionWrapper);
  consoleErrorSpy = spyOn(console, 'error').and.returnValue(null);
}

describe('UtilsService()', () => {
  describe('createDirectory()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.createDirectory).toEqual('function');
    });

    it('calls staticFunctionWrapper.mkdirpSync()', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'mkdirpSync').and.callThrough();
      const path = 'test/path';
      service.createDirectory(path);
      expect(spy).toHaveBeenCalled();
    });

    it('calls console.error when mkdirpSync throws an error', () => {
      service.staticFunctionWrapper.mkdirpSync = () => {
        throw Error('test mkdirpSync error');
      };
      const path = 'test/path';
      service.createDirectory(path);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('calls staticFunctionWrapper.process.exit when mkdirpSync throws an error', () => {
      service.staticFunctionWrapper.mkdirpSync = () => {
        throw Error('test mkdirpSync error');
      };
      const spy = spyOn(service.staticFunctionWrapper.process, 'exit').and.callThrough();
      const path = 'test/path';
      service.createDirectory(path);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('createDirectoryIfNotExists()', () => {
    beforeEach(() => {
      init();
      service.pathExists = () => false;
      service.createDirectory = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.createDirectoryIfNotExists).toEqual('function');
    });

    it('calls createDirectory() when the path does not exist', () => {
      const spy = spyOn(service, 'createDirectory').and.callThrough();
      const path = 'test/path';
      service.createDirectoryIfNotExists(path);
      expect(spy).toHaveBeenCalledWith(path);
    });

    it('calls console.error when pathExists', () => {
      service.pathExists = () => true;
      const path = 'test/path';
      service.createDirectoryIfNotExists(path);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('calls staticFunctionWrapper.process.exit when pathExists', () => {
      service.pathExists = () => true;
      const spy = spyOn(service.staticFunctionWrapper.process, 'exit').and.callThrough();
      const path = 'test/path';
      service.createDirectoryIfNotExists(path);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('pathExists()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.pathExists).toEqual('function');
    });

    it('calls staticFunctionWrapper.existsSync', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'existsSync').and.callThrough();
      const path = 'test/path';
      service.pathExists(path);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('readFile()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.readFile).toEqual('function');
    });

    it('calls staticFunctionWrapper.readFileSync()', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'readFileSync').and.callThrough();
      const fileName = 'test.file';
      service.readFile(fileName);
      expect(spy).toHaveBeenCalledWith(fileName, { encoding: 'utf-8' });
    });

    it('returns the file contents', () => {
      const fileName = 'test.file';
      const result = service.readFile(fileName);
      expect(result).toEqual('test file contents');
    });
  });

  describe('resolve()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.resolve).toEqual('function');
    });

    it('calls staticFunctionWrapper.resolve', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'resolve').and.callThrough();
      const pathSegments = ['test', 'path'];
      service.resolve(pathSegments);
      expect(spy).toHaveBeenCalledWith(...pathSegments);
    });
  });

  describe('writeFile()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writeFile).toEqual('function');
    });

    it('calls staticFunctionWrapper.writeFileSync()', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'writeFileSync').and.callThrough();
      const file = 'test.file';
      const text = 'test text';
      service.writeFile(file, text);
      expect(spy).toHaveBeenCalledWith(file, text, { encoding: 'utf-8' });
    });

    it('calls console.error when writeFileSync throws an error', () => {
      service.staticFunctionWrapper.writeFileSync = () => {
        throw Error('test writeFileSync error');
      };
      const file = 'test.file';
      const text = 'test text';
      service.writeFile(file, text);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('calls staticFunctionWrapper.process.exit when writeFileSync throws an error', () => {
      service.staticFunctionWrapper.writeFileSync = () => {
        throw Error('test writeFileSync error');
      };
      const spy = spyOn(service.staticFunctionWrapper.process, 'exit').and.callThrough();
      const file = 'test.file';
      const text = 'test text';
      service.writeFile(file, text);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
