import { NpmService } from './npm.service';
import { FileExtension, NpmDependencyType } from '../../enums';

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  execute: () => undefined,
  getFileAsJson: () => ({}),
  getFileExtension: () => FileExtension.TS,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
  writeJsonFile: () => undefined,
};

let service: any;
function init(): void {
  service = new NpmService(utilsService);
}

describe('NpmService()', () => {
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
      service.hasPackageJson = () => false;
      service.initGitIgnore = () => undefined;
      service.initEditorConfig = () => undefined;
      service.cleanPackageJson = () => undefined;
      service.createIndexJs = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });

    it('calls hasPackageJson()', () => {
      const spy = spyOn(service, 'hasPackageJson').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.execute()', () => {
      const spy = spyOn(service.utilsService, 'execute').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith('npm init -y');
    });

    it('calls initGitIgnore()', () => {
      const spy = spyOn(service, 'initGitIgnore').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls initEditorConfig()', () => {
      const spy = spyOn(service, 'initEditorConfig').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls cleanPackageJson()', () => {
      const spy = spyOn(service, 'cleanPackageJson').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.getFileExtension()', () => {
      const spy = spyOn(service.utilsService, 'getFileExtension').and.callThrough();
      const args = ['-x'];
      service.init(args);
      expect(spy).toHaveBeenCalledWith(args);
    });

    it('calls createIndexJs()', () => {
      const spy = spyOn(service, 'createIndexJs').and.callThrough();
      service.init();
      expect(spy).toHaveBeenCalledWith(FileExtension.TS);
    });
  });

  describe('installPackages()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.installPackages).toEqual('function');
    });

    it('calls utilsService.execute()', () => {
      const packages = ['test-1', 'test-2'];
      const packageType = NpmDependencyType.DEV_DEPENDENCY;
      const spy = spyOn(service.utilsService, 'execute').and.callThrough();
      service.installPackages(packages, packageType);
      expect(spy).toHaveBeenCalledWith('npm i -D --ignore-scripts test-1 test-2');
    });

    it('calls utilsService.execute()', () => {
      const packages = ['test-1', 'test-2'];
      const packageType = NpmDependencyType.DEPENDENCY;
      const spy = spyOn(service.utilsService, 'execute').and.callThrough();
      service.installPackages(packages, packageType);
      expect(spy).toHaveBeenCalledWith('npm i -S --ignore-scripts test-1 test-2');
    });
  });

  describe('hasPackageJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.hasPackageJson).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(service.utilsService, 'pathExists').and.callThrough();
      service.hasPackageJson();
      expect(spy).toHaveBeenCalledWith(service.packageJsonFile);
    });
  });

  describe('hasGitIgnore()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.hasGitIgnore).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(service.utilsService, 'pathExists').and.callThrough();
      service.hasGitIgnore();
      expect(spy).toHaveBeenCalledWith(service.gitignoreFile);
    });
  });

  describe('hasEditorConfig()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.hasEditorConfig).toEqual('function');
    });

    it('calls utilsService.pathExists()', () => {
      const spy = spyOn(service.utilsService, 'pathExists').and.callThrough();
      service.hasEditorConfig();
      expect(spy).toHaveBeenCalledWith(service.editorconfigFile);
    });
  });

  describe('initGitIgnore()', () => {
    beforeEach(() => {
      init();
      service.hasGitIgnore = () => false;
    });

    it('is a function', () => {
      expect(typeof service.initGitIgnore).toEqual('function');
    });

    it('calls hasGitIgnore()', () => {
      const spy = spyOn(service, 'hasGitIgnore').and.callThrough();
      service.initGitIgnore();
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.writeFile()', () => {
      const text = `
coverage/
dist/
node_modules/
tmp/

*.tar
*.gz
*.bz2
*.zip

*.crt
*.csr
*.key
*.p12
*.srl
*.pub
`;
      const spy = spyOn(service.utilsService, 'writeFile').and.callThrough();
      service.initGitIgnore();
      expect(spy).toHaveBeenCalledWith(service.gitignoreFile, text);
    });
  });

  describe('initEditorConfig()', () => {
    beforeEach(() => {
      init();
      service.hasEditorConfig = () => false;
    });

    it('is a function', () => {
      expect(typeof service.initEditorConfig).toEqual('function');
    });

    it('calls hasEditorConfig()', () => {
      const spy = spyOn(service, 'hasEditorConfig').and.callThrough();
      service.initEditorConfig();
      expect(spy).toHaveBeenCalled();
    });

    it('calls utilsService.writeFile()', () => {
      const text = `
# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
max_line_length = 100
quote_type = single
spaces_around_brackets = indside
spaces_around_operators = true
trim_trailing_whitespace = true

[{*.md,*.json}]
max_line_length = off

# The JSON files contain newlines inconsistently
[*.json]
insert_final_newline = ignore

[*.md]
trim_trailing_whitespace = false

# Minified JavaScript files shouldn't be changed
[**.min.js]
indent_style = ignore
insert_final_newline = ignore
`;
      const spy = spyOn(service.utilsService, 'writeFile').and.callThrough();
      service.initEditorConfig();
      expect(spy).toHaveBeenCalledWith(service.editorconfigFile, text);
    });
  });

  describe('getPackageJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.getPackageJson).toEqual('function');
    });

    it('calls utilsService.getFileAsJson()', () => {
      const spy = spyOn(service.utilsService, 'getFileAsJson').and.callThrough();
      service.getPackageJson();
      expect(spy).toHaveBeenCalledWith(service.packageJsonFile);
    });
  });

  describe('writePackageJson()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.writePackageJson).toEqual('function');
    });

    it('calls utilsService.writeJsonFile() with the given json', () => {
      const json = { test: 'json' };
      const spy = spyOn(service.utilsService, 'writeJsonFile').and.callThrough();
      service.writePackageJson(json);
      expect(spy).toHaveBeenCalledWith(service.packageJsonFile, json);
    });
  });

  describe('cleanPackageJson()', () => {
    beforeEach(() => {
      init();
      service.getPackageJson = () => ({
        name: 'test-name',
        version: 'test-version',
        license: 'test-license',
        author: 'test-author',
        private: true,
        scripts: { start: 'node src/index.js' },
      });
      service.writePackageJson = () => undefined;
    });

    it('is a function', () => {
      expect(typeof service.cleanPackageJson).toEqual('function');
    });

    it('calls getPackageJson()', () => {
      const spy = spyOn(service, 'getPackageJson').and.callThrough();
      service.cleanPackageJson();
      expect(spy).toHaveBeenCalled();
    });

    it('calls writePackageJson() with the new package.json object', () => {
      const expected = {
        name: 'test-name',
        version: 'test-version',
        license: 'test-license',
        author: 'test-author',
        private: true,
        scripts: { start: 'node src/index.js' },
      };
      const spy = spyOn(service, 'writePackageJson').and.callThrough();
      service.cleanPackageJson();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('createIndexJs()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.createIndexJs).toEqual('function');
    });

    it('calls utilsService.resolve() to get the src folder', () => {
      const spy = spyOn(service.utilsService, 'resolve').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexJs(fileExtension);
      expect(spy).toHaveBeenCalledWith(['src']);
    });

    it('calls utilsService.createDirectoryIfNotExists()', () => {
      const spy = spyOn(service.utilsService, 'createDirectoryIfNotExists').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexJs(fileExtension);
      expect(spy).toHaveBeenCalledWith('src');
    });

    it('calls utilsService.resolve() to get the index file', () => {
      const spy = spyOn(service.utilsService, 'resolve').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexJs(fileExtension);
      expect(spy).toHaveBeenCalledWith(['src', `index.${fileExtension}`]);
    });

    it('calls utilsService.writeFile() with index file and contents', () => {
      const spy = spyOn(service.utilsService, 'writeFile').and.callThrough();
      const fileExtension = FileExtension.TS;
      service.createIndexJs(fileExtension);
      expect(spy).toHaveBeenCalledWith(
        `src/index.${fileExtension}`,
        "console.log('new npm project')"
      );
    });
  });
});
