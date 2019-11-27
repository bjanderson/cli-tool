import { getObject, getString, getValueOrDefault } from '@lernato/common';
import { FileExtension } from '../../enums/file-extensions';

export class ModelConfig {
  static readonly defaultModelsFolder = 'src/models';

  camel: string;
  file: string;
  fileExt: FileExtension;
  folder: string;
  index: string;
  kabob: string;
  modelsIndexFile: string;
  modelsFolder: string;
  name: string;
  pascal: string;
  spec: string;

  constructor(o?: Partial<ModelConfig>) {
    const obj: Partial<ModelConfig> = getObject(o);
    this.camel = getString(obj.camel);
    this.file = getString(obj.file);
    this.fileExt = getValueOrDefault(obj.fileExt, FileExtension.TS);
    this.folder = getString(obj.folder);
    this.index = getString(obj.index);
    this.kabob = getString(obj.kabob);
    this.modelsIndexFile = getString(obj.modelsIndexFile);
    this.modelsFolder = getString(obj.modelsFolder);
    this.name = getString(obj.name);
    this.pascal = getString(obj.pascal);
    this.spec = getString(obj.spec);
  }
}
