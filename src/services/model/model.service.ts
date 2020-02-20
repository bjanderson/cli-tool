import { camelFromKabobOrPascal, lowerize, pascalFromKabobOrCamel } from '@lernato/common';
import { FileExtension } from '../../enums';
import { ModelConfig } from '../../models';
import { UtilsService } from '../utils';

export class ModelService {
  constructor(private utilsService: UtilsService) {}

  createModel(args: string[]): void {
    const modelName = args.shift();
    if (modelName.startsWith('-')) {
      console.error('Invalid model name');
      this.utilsService.exit(1);
    }
    const fileExt = this.utilsService.getFileExtension(args);
    const modelsFolder = this.getModelsFolder(args);
    const modelConfig = this.createModelConfig(modelName, fileExt, modelsFolder);
    this.createNewModel(modelConfig);
  }

  getModelsFolder(args: string[]): string {
    const i = args.findIndex((arg) => arg === '-f' || arg === '--models-folder');
    return i < 0 ? ModelConfig.defaultModelsFolder : args[i + 1];
  }

  createModelConfig(name: string, fileExt: FileExtension, modelsLocation: string): ModelConfig {
    const camel = camelFromKabobOrPascal(name);
    const kabob = lowerize(name);
    const pascal = pascalFromKabobOrCamel(name);
    const modelsFolder = this.utilsService.resolve(modelsLocation.split('/'));
    const modelsIndexFile = this.utilsService.resolve([modelsFolder, `index.${fileExt}`]);
    const folder = this.utilsService.resolve([modelsFolder, kabob]);
    const file = this.utilsService.resolve([folder, `${kabob}.model.${fileExt}`]);
    const spec = this.utilsService.resolve([folder, `${kabob}.model.spec.${fileExt}`]);
    const index = this.utilsService.resolve([folder, `index.${fileExt}`]);

    const config = new ModelConfig({
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
    });

    console.log('\nconfig :', config, '\n');

    return config;
  }

  createNewModel(config: ModelConfig): void {
    this.utilsService.createDirectoryIfNotExists(config.folder);
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

  createJSModel(config: ModelConfig): void {
    const text = `import { getObject, getString } from '@lernato/common';

export class ${config.pascal} {
  constructor(o) {
    const obj = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
    this.utilsService.writeFile(config.file, text);
  }

  createTSModel(config: ModelConfig): void {
    const text = `import { getObject, getString } from '@lernato/common';

export class ${config.pascal} {
  value: string;

  constructor(o?: Partial<${config.pascal}>) {
    const obj: Partial<${config.pascal}> = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
    this.utilsService.writeFile(config.file, text);
  }

  createModelSpec(config: ModelConfig): void {
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
    this.utilsService.writeFile(config.spec, text);
  }

  createModelIndex(config: ModelConfig): void {
    const text = `export * from './${config.kabob}.model';
`;
    this.utilsService.writeFile(config.index, text);
  }

  updateModelsIndex(config: ModelConfig): void {
    const indexContents = this.utilsService.readFile(config.modelsIndexFile).trim();
    const parts = indexContents.split('\n');
    const modelsExportText = `export * from './${config.kabob}';`;
    if (!parts.includes(modelsExportText)) {
      parts.push(modelsExportText);
    }
    parts.sort((a: string, b: string) => a.localeCompare(b));
    const text = `${parts.join('\n').trim()}\n`;
    this.utilsService.writeFile(config.modelsIndexFile, text);
  }

  createModelsIndexIfNotExists(config: ModelConfig): void {
    if (!this.utilsService.pathExists(config.modelsIndexFile)) {
      const text = '';
      this.utilsService.createDirectory(config.modelsFolder);
      this.utilsService.writeFile(config.modelsIndexFile, text);
    }
  }
}
