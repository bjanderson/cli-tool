import { DEFAULT_STRING } from '@lernato/common';
import { FileExtension } from '../../enums/file-extensions';
import { ServiceConfig } from './service-config.model';

describe('ServiceConfig', () => {
  describe('constructor defaults', () => {
    const defaults = {
      camel: DEFAULT_STRING,
      file: DEFAULT_STRING,
      fileExt: FileExtension.TS,
      folder: DEFAULT_STRING,
      index: DEFAULT_STRING,
      kabob: DEFAULT_STRING,
      servicesIndexFile: DEFAULT_STRING,
      servicesFolder: DEFAULT_STRING,
      name: DEFAULT_STRING,
      pascal: DEFAULT_STRING,
      spec: DEFAULT_STRING,
    };

    it('should have the expected fields', () => {
      expect(Object.keys(defaults)).toEqual(Object.keys(new ServiceConfig()));
    });

    it('should set the default values when given no input object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ServiceConfig()));
    });

    it('should set the default values when given null', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ServiceConfig(null)));
    });

    it('should set the default values when given an empty object', () => {
      expect(Object.values(defaults)).toEqual(Object.values(new ServiceConfig({})));
    });
  });

  describe('constructor assignments', () => {
    it('should set all values passed into the constructor', () => {
      const test = {
        camel: 'test camel',
        file: 'test file',
        fileExt: FileExtension.JS,
        folder: 'test folder',
        index: 'test index',
        kabob: 'test kabob',
        servicesIndexFile: 'test servicesIndexFile',
        servicesFolder: 'test servicesFolder',
        name: 'test name',
        pascal: 'test pascal',
        spec: 'test spec',
      };

      expect(Object.values(test)).toEqual(Object.values(new ServiceConfig(test)));
    });
  });
});
