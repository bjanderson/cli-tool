#!/usr/bin/env node

import { IModelConfig } from './model-config.interface';
import { readFile, writeFile } from './utils';

export function createModel(config: IModelConfig): void {
  const text = `import { getObject, getString } from '@lernato/common';

export class ${config.pascal} {
  public value: string;

  constructor(o?: Partial<${config.pascal}>) {
    const obj = getObject(o);
    this.value = getString(obj.value);
  }
}
`;
  writeFile(config.file, text);
}

export function createModelSpec(config: IModelConfig): void {
  const text = `import { DEFAULT_STRING } from '@lernato/common';
import { ${config.pascal} } from './${config.kabob}.model

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
  writeFile(config.spec, text);
}

export function createModelIndex(config: IModelConfig): void {
  const text = `${config.exportText}
  `;
  writeFile(config.index, text);
}

export function updateModelsIndex(config: IModelConfig): void {
  const indexContents = readFile(config.modelsIndexFile);
  const parts = indexContents.split('\n');
  if (!parts.includes(config.modelsExportText)) {
    parts.push(config.modelsExportText);
    parts.sort((a, b) => a.localeCompare(b));
  }
  const text = parts.join('\n');
  writeFile(config.modelsIndexFile, text);
}
