import { InitTypeScriptService } from './init-typescript.service';

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
  service = new InitTypeScriptService(utilsService);
}

describe('InitTypeScriptService()', () => {
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
