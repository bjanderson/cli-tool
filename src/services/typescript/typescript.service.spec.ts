import { TypeScriptService } from './typescript.service';

const npmService: any = {};

const utilsService: any = {
  createDirectory: () => undefined,
  createDirectoryIfNotExists: () => undefined,
  pathExists: () => false,
  readFile: () => undefined,
  resolve: (pathSegments: string[]) => pathSegments.join('/'),
  writeFile: () => undefined,
};

let service: any;
function init() {
  service = new TypeScriptService(npmService, utilsService);
}

describe('TypeScriptService()', () => {
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
    });

    it('is a function', () => {
      expect(typeof service.init).toEqual('function');
    });
  });
});