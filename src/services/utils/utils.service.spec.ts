import { UtilsService } from './utils.service';
import { FileExtension } from '../../enums';

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
function init(): void {
  service = new UtilsService(staticFunctionWrapper);
  spyOn(console, 'log').and.returnValue(null);
  spyOn(console, 'warn').and.returnValue(null);
  spyOn(console, 'error').and.returnValue(null);
}

describe('UtilsService()', () => {
  describe('createDirectory()', () => {
    beforeEach(() => {
      init();
      service.exit = () => undefined;
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
      expect(console.error).toHaveBeenCalledTimes(2);
    });

    it('calls exit when mkdirpSync throws an error', () => {
      service.staticFunctionWrapper.mkdirpSync = () => {
        throw Error('test mkdirpSync error');
      };
      const spy = spyOn(service, 'exit').and.callThrough();
      const path = 'test/path';
      service.createDirectory(path);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('createDirectoryIfNotExists()', () => {
    beforeEach(() => {
      init();
      service.createDirectory = () => undefined;
      service.exit = () => undefined;
      service.pathExists = () => false;
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
      expect(console.error).toHaveBeenCalled();
    });

    it('calls exit when pathExists', () => {
      service.pathExists = () => true;
      const spy = spyOn(service, 'exit').and.callThrough();
      const path = 'test/path';
      service.createDirectoryIfNotExists(path);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('exit()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.exit).toEqual('function');
    });

    it('calls staticFunctionWrapper.process.exit() with the given value', () => {
      const spy = spyOn(service.staticFunctionWrapper.process, 'exit').and.callThrough();
      service.exit(1);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('getFileAsJson()', () => {
    beforeEach(() => {
      init();
      service.pathExists = () => false;
      service.readFile = () => '{"test": "json"}';
    });

    it('is a function', () => {
      expect(typeof service.getFileAsJson).toEqual('function');
    });

    it('calls pathExists()', () => {
      const spy = spyOn(service, 'pathExists').and.callThrough();
      const filename = 'test-file';
      service.getFileAsJson(filename);
      expect(spy).toHaveBeenCalledWith(filename);
    });

    it('calls console.warn() when path does not exist', () => {
      const filename = 'test-file';
      service.getFileAsJson(filename);
      expect(console.warn).toHaveBeenCalledWith(
        'WARNING: Could not find test-file - make sure you are in your top-level project folder'
      );
    });

    it('returns an empty object when path does not exist', () => {
      const filename = 'test-file';
      const result = service.getFileAsJson(filename);
      expect(result).toEqual({});
    });

    it('calls readFile()', () => {
      service.pathExists = () => true;
      const spy = spyOn(service, 'readFile').and.callThrough();
      const filename = 'test-file';
      service.getFileAsJson(filename);
      expect(spy).toHaveBeenCalledWith(filename);
    });

    it('returns the file contents from readFile as json', () => {
      service.pathExists = () => true;
      const expected: any = { test: 'json' };
      const filename = 'test-file';
      const result = service.getFileAsJson(filename);
      expect(result).toEqual(expected);
    });

    it('calls console.error() when readFile throws an error', () => {
      service.pathExists = () => true;
      service.readFile = () => {
        throw new Error('test error');
      };
      const filename = 'test-file';
      service.getFileAsJson(filename);
      expect(console.error).toHaveBeenCalledWith(`ERROR: Could not read file ${filename}`);
    });

    it('returns an empty object when readFile throws an error', () => {
      service.pathExists = () => true;
      service.readFile = () => {
        throw new Error('test error');
      };
      const filename = 'test-file';
      const result = service.getFileAsJson(filename);
      expect(result).toEqual({});
    });
  });

  describe('getFileExtension()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getFileExtension).toEqual('function');
    });

    it('returns FileExtension.JS when args has "-j"', () => {
      const args = ['test', '-j'];
      const result = service.getFileExtension(args);
      expect(result).toEqual(FileExtension.JS);
    });

    it('returns FileExtension.JS when args has "--vanillajs"', () => {
      const args = ['test', '--vanillajs'];
      const result = service.getFileExtension(args);
      expect(result).toEqual(FileExtension.JS);
    });

    it('returns FileExtension.TS by default', () => {
      const args = ['test'];
      const result = service.getFileExtension(args);
      expect(result).toEqual(FileExtension.TS);
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
      service.exit = () => undefined;
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
      expect(console.error).toHaveBeenCalledTimes(2);
    });

    it('calls exit when writeFileSync throws an error', () => {
      service.staticFunctionWrapper.writeFileSync = () => {
        throw Error('test writeFileSync error');
      };
      const spy = spyOn(service, 'exit').and.callThrough();
      const file = 'test.file';
      const text = 'test text';
      service.writeFile(file, text);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('writeJsonFile()', () => {
    beforeEach(() => {
      init();
      service.writeFile = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.writeJsonFile).toEqual('function');
    });

    it('calls writeFile() with filename and stringified json', () => {
      const spy = spyOn(service, 'writeFile').and.callThrough();
      const filename = 'test-file';
      const json = { test: 'json' };
      service.writeJsonFile(filename, json);
      expect(spy).toHaveBeenCalledWith(
        filename,
        `{
  "test": "json"
}`
      );
    });
  });

  describe('execute()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.execute).toEqual('function');
    });

    it('calls staticFunctionWrapper.execSync() with the given command', () => {
      const spy = spyOn(service.staticFunctionWrapper, 'execSync').and.callThrough();
      const command = 'test command';
      service.execute(command);
      expect(spy).toHaveBeenCalledWith(command);
    });

    it('calls console.error when execSync throws an error', () => {
      service.staticFunctionWrapper.execSync = () => {
        throw Error('test execSync error');
      };
      const command = 'test command';
      service.execute(command);
      expect(console.error).toHaveBeenCalledTimes(2);
    });
  });
});
