import {
  camelFromKabobOrPascal,
  lowerize,
  pascalFromKabobOrCamel,
  titleFromKabob,
  upperSnakeFromKabob,
} from '@lernato/common';
import fse from 'fs-extra';
import { resolve } from 'path';
import { IModelConfig } from './model-config.interface';

export function readFile(fileName: string): string {
  const fileContents = fse.readFileSync(fileName, { encoding: 'utf-8' });
  console.log('fileContents :', fileContents);
  return fileContents;
}

export function writeFile(file: string, text: string): void {
  try {
    fse.writeFileSync(file, text, { encoding: 'utf-8' });
  } catch (err) {
    console.error(`Failed to write file: ${file}`);
    process.exit(1);
  }
}

export function directoryExists(path: string): boolean {
  return fse.existsSync(path);
}

export function createDirectory(path: string): void {
  try {
    fse.mkdirpSync(path);
  } catch (err) {
    console.error(`Failed to create directory: ${path}`);
    process.exit(1);
  }
}

export function createDirectoryIfNotExists(path: string): void {
  if (directoryExists(path)) {
    console.error(`${path} already exists. Please enter a different name`);
    process.exit(1);
  }
  createDirectory(path);
}

export function createModelConfig(name: string): IModelConfig {
  const camel = camelFromKabobOrPascal(name);
  const kabob = lowerize(name);
  const pascal = pascalFromKabobOrCamel(name);
  const title = titleFromKabob(name);
  const snake = upperSnakeFromKabob(name);
  const modelsFolder = resolve('models');
  const modelsIndexFile = resolve(modelsFolder, 'index.ts');
  const folder = resolve(modelsFolder, kabob);
  const file = resolve(folder, `${kabob}.model.ts`);
  const spec = resolve(folder, `${kabob}.model.spec.ts`);
  const index = resolve(folder, `index.ts`);
  const exportText = `export * from './${kabob}.model';`;
  const modelsExportText = `export * from './${kabob}';`;

  const config: IModelConfig = {
    camel,
    kabob,
    name,
    pascal,
    title,
    snake,
    modelsFolder,
    modelsIndexFile,
    folder,
    file,
    spec,
    index,
    exportText,
    modelsExportText,
  };

  console.log('config :', config);

  return config;
}
