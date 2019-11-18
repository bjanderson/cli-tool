import { camelFromKabobOrPascal, lowerize, pascalFromKabobOrCamel } from '@lernato/common';
import { existsSync, mkdirpSync, readFileSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';
import { IModelConfig } from './model-config.interface';

export function readFile(fileName: string): string {
  const fileContents = readFileSync(fileName, { encoding: 'utf-8' });
  return fileContents;
}

export function writeFile(file: string, text: string): void {
  try {
    writeFileSync(file, text, { encoding: 'utf-8' });
  } catch (err) {
    console.error(`Failed to write file: ${file}`);
    console.error(err);
    process.exit(1);
  }
}

export function pathExists(path: string): boolean {
  return existsSync(path);
}

export function createDirectory(path: string): void {
  try {
    mkdirpSync(path);
  } catch (err) {
    console.error(`Failed to create directory: ${path}`);
    console.error(err);
    process.exit(1);
  }
}

export function createDirectoryIfNotExists(path: string): void {
  if (pathExists(path)) {
    console.error(`${path} already exists. Please enter a different name.`);
    process.exit(1);
  }
  createDirectory(path);
}

export function createModelConfig(name: string, fileExt: string): IModelConfig {
  const camel = camelFromKabobOrPascal(name);
  const kabob = lowerize(name);
  const pascal = pascalFromKabobOrCamel(name);
  const modelsFolder = resolve('models');
  const modelsIndexFile = resolve(modelsFolder, `index.${fileExt}`);
  const folder = resolve(modelsFolder, kabob);
  const file = resolve(folder, `${kabob}.model.${fileExt}`);
  const spec = resolve(folder, `${kabob}.model.spec.${fileExt}`);
  const index = resolve(folder, `index.${fileExt}`);
  const exportText = `export * from './${kabob}.model';`;
  const modelsExportText = `export * from './${kabob}';`;

  const config: IModelConfig = {
    camel,
    exportText,
    file,
    fileExt,
    folder,
    index,
    kabob,
    modelsExportText,
    modelsFolder,
    modelsIndexFile,
    name,
    pascal,
    spec,
  };

  console.log('\nconfig :', config, '\n');

  return config;
}
