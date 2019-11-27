import { getObject, getString, getValueOrDefault } from '@lernato/common';
import { FileExtension } from '../../enums/file-extensions';

export class ServiceConfig {
  static readonly defaultServicesFolder = 'src/services';

  camel: string;
  file: string;
  fileExt: FileExtension;
  folder: string;
  index: string;
  kabob: string;
  servicesIndexFile: string;
  servicesFolder: string;
  name: string;
  pascal: string;
  spec: string;

  constructor(o?: Partial<ServiceConfig>) {
    const obj: Partial<ServiceConfig> = getObject(o);
    this.camel = getString(obj.camel);
    this.file = getString(obj.file);
    this.fileExt = getValueOrDefault(obj.fileExt, FileExtension.TS);
    this.folder = getString(obj.folder);
    this.index = getString(obj.index);
    this.kabob = getString(obj.kabob);
    this.servicesIndexFile = getString(obj.servicesIndexFile);
    this.servicesFolder = getString(obj.servicesFolder);
    this.name = getString(obj.name);
    this.pascal = getString(obj.pascal);
    this.spec = getString(obj.spec);
  }
}
