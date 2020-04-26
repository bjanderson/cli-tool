import { EslintService } from './eslint.service';
import { FileExtension } from '../../enums';

const npmService: any = {
  getPackageJson: () => {},
  installPackages: () => undefined,
  writePackageJson: () => undefined,
};

const utilsService: any = {
  getFileExtension: () => FileExtension.TS,
  getFileAsJson: () => {},
  pathExists: () => true,
  resolve: () => '',
  writeJsonFile: () => undefined,
};

let service: any;
function init(): void {
  service = new EslintService(npmService, utilsService);
}

describe('EslintService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
