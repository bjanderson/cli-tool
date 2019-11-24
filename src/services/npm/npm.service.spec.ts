import { NpmService } from './npm.service';

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

  describe('installPackages()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof service.installPackages).toEqual('function');
    });
  });
});
