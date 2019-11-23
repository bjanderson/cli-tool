import { JestService } from './jest.service';

const npmService: any = {};

const typeScriptService: any = {};

let service: any;
function init() {
  service = new JestService(npmService, typeScriptService);
}

describe('JestService()', () => {
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
