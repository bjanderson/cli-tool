#!/usr/bin/env node

import { camelFromKabobOrPascal, lowerize, pascalFromKabobOrCamel } from '@lernato/common';
import { CommandLineOptions } from 'command-line-args';
import { IModelConfig } from './model-config.interface';
import { UtilsService } from './utils.service';

export class ModelGenerator {
  constructor(private utils: UtilsService) {}

  public createModels(cliOptions: CommandLineOptions): void {
    const modelNames = cliOptions.create;
    const fileExt = cliOptions.vanillaJavascript ? 'js' : 'ts';
    for (const name of modelNames) {
      const config = this.createModelConfig(name, fileExt);
      this.createNewModel(config);
    }

    console.log('\nModels generated successfully.\n');
  }

  public createModelConfig(name: string, fileExt: string): IModelConfig {
    const camel = camelFromKabobOrPascal(name);
    const kabob = lowerize(name);
    const pascal = pascalFromKabobOrCamel(name);
    const modelsFolder = this.utils.resolve(['models']);
    const modelsIndexFile = this.utils.resolve([modelsFolder, `index.${fileExt}`]);
    const folder = this.utils.resolve([modelsFolder, kabob]);
    const file = this.utils.resolve([folder, `${kabob}.model.${fileExt}`]);
    const spec = this.utils.resolve([folder, `${kabob}.model.spec.${fileExt}`]);
    const index = this.utils.resolve([folder, `index.${fileExt}`]);

    const config: IModelConfig = {
      camel,
      file,
      fileExt,
      folder,
      index,
      kabob,
      modelsFolder,
      modelsIndexFile,
      name,
      pascal,
      spec,
    };

    console.log('\nconfig :', config, '\n');

    return config;
  }

  public createNewModel(config: IModelConfig): void {
    this.utils.createDirectoryIfNotExists(config.folder);
    this.createModelsIndexIfNotExists(config);
    if (config.fileExt === 'js') {
      this.createJSModel(config);
    } else {
      this.createTSModel(config);
    }
    this.createModelSpec(config);
    this.createModelIndex(config);
    this.updateModelsIndex(config);
  }

  public createJSModel(config: IModelConfig): void {
    const text = `import { getObject, getString } from '@lernato/common';

export class ${config.pascal} {
  constructor(o) {
    const obj = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
    this.utils.writeFile(config.file, text);
  }

  public createTSModel(config: IModelConfig): void {
    const text = `import { getObject, getString } from '@lernato/common';

export class ${config.pascal} {
  public value: string;

  constructor(o?: Partial<${config.pascal}>) {
    const obj: Partial<${config.pascal}> = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
    this.utils.writeFile(config.file, text);
  }

  public createModelSpec(config: IModelConfig): void {
    const text = `import { DEFAULT_STRING } from '@lernato/common';
import { ${config.pascal} } from './${config.kabob}.model';

describe('${config.pascal}', () => {
  describe('constructor defaults', () => {
    const defaults = {
      value: DEFAULT_STRING,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new ${config.pascal}()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ${config.pascal}()));
    });

    it('should set the default values when given null', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ${config.pascal}(null)));
    });

    it('should set the default values when given an empty object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ${config.pascal}({})));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        value: 'test value',
      };

      expect(Object.values(test)).toEqual(Object.values(new ${config.pascal}(test)));
    });
  });
});
`;
    this.utils.writeFile(config.spec, text);
  }

  public createModelIndex(config: IModelConfig): void {
    const text = `export * from './${config.kabob}.model';
`;
    this.utils.writeFile(config.index, text);
  }

  public updateModelsIndex(config: IModelConfig): void {
    const indexContents = this.utils.readFile(config.modelsIndexFile).trim();
    const parts = indexContents.split('\n');
    const modelsExportText = `export * from './${config.kabob}';`;
    if (!parts.includes(modelsExportText)) {
      parts.push(modelsExportText);
    }
    parts.sort((a: string, b: string) => a.localeCompare(b));
    const text = `${parts.join('\n')}\n`;
    this.utils.writeFile(config.modelsIndexFile, text);
  }

  public createModelsIndexIfNotExists(config: IModelConfig): void {
    if (!this.utils.pathExists(config.modelsIndexFile)) {
      const text = '';
      this.utils.createDirectory(config.modelsFolder);
      this.utils.writeFile(config.modelsIndexFile, text);
    }
  }
}
