import { ExpressServerService } from './express-server.service';

const npmService: any = {
  init: () => undefined,
};

const typeScriptService: any = {
  init: () => undefined,
};

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
  service = new ExpressServerService(npmService, typeScriptService, utilsService);
}

describe('ExpressServerService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
