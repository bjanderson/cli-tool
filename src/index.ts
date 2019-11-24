#!/usr/bin/env node

import { App } from './app';
import {
  CLIService,
  JestService,
  ModelService,
  NpmService,
  PrettierService,
  TypeScriptService,
  UtilsService,
} from './services';
import { staticFunctionWrapper } from './static-function-wrapper';

const utilsServiceInstance = new UtilsService(staticFunctionWrapper);
const npmServiceInstance = new NpmService(utilsServiceInstance);
const modelServiceInstance = new ModelService(utilsServiceInstance);

const typeScriptServiceInstance = new TypeScriptService(npmServiceInstance, utilsServiceInstance);

const jestServiceInstance = new JestService(
  npmServiceInstance,
  typeScriptServiceInstance,
  utilsServiceInstance
);
const prettierServiceInstance = new PrettierService(
  npmServiceInstance,
  typeScriptServiceInstance,
  utilsServiceInstance
);

const cliServiceInstance = new CLIService(
  jestServiceInstance,
  prettierServiceInstance,
  typeScriptServiceInstance,
  modelServiceInstance,
  utilsServiceInstance
);

const args = process.argv.slice(2).map((arg) => arg.toLocaleLowerCase());
const app = new App(cliServiceInstance);
app.run(args);
