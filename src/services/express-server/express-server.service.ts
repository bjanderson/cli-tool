import { FileExtension, NpmDependencyType } from '../../enums';
import { NpmService } from '../npm';
import { TypeScriptService } from '../typescript';
import { UtilsService } from '../utils';

export class ExpressServerService {
  constructor(
    private npmService: NpmService,
    private typeScriptService: TypeScriptService,
    private utilsService: UtilsService
  ) {}

  init(args: string[]): void {
    const fileExtension = this.utilsService.getFileExtension(args);
    const isVanillaJs = fileExtension === FileExtension.JS;
    if (!isVanillaJs) {
      this.typeScriptService.init(args);
    } else {
      this.npmService.init(args);
    }
    this.installPackages(isVanillaJs);
  }

  installPackages(isVanillaJs: boolean): void {
    const packages = ['@lernato/common', 'body-parser', 'express', 'lowdb', 'morgan', 'uuid'];
    this.npmService.installPackages(packages, NpmDependencyType.DEPENDENCY);
    if (!isVanillaJs) {
      const devPackages = [
        '@types/body-parser',
        '@types/express',
        '@types/lowdb',
        '@types/morgan',
        '@types/node',
        '@types/uuid',
      ];
      this.npmService.installPackages(devPackages, NpmDependencyType.DEV_DEPENDENCY);
    }
  }
}
