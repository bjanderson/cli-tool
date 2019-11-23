import { CLIService } from './cli.service';

const jestService: any = {
  init: () => undefined,
};

const prettierService: any = {
  init: () => undefined,
};

const typeScriptService: any = {
  init: () => undefined,
};

const newModelService: any = {
  createModel: () => undefined,
};

const utilsService: any = {
  exit: () => undefined,
};

let service: any;
function init() {
  service = new CLIService(
    jestService,
    prettierService,
    typeScriptService,
    newModelService,
    utilsService
  );
}

describe('CLIService()', () => {
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
