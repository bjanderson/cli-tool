import { getObject, getString } from '@lernato/common';

export class ModelConfig {
  camel: string;
  file: string;
  fileExt: string;
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
    this.fileExt = getString(obj.fileExt);
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
