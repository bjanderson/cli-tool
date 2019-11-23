#!/usr/bin/env node

import { App } from './app';
import {
  CLIService,
  JestService,
  NewModelService,
  NpmService,
  PrettierService,
  TypeScriptService,
  UtilsService,
} from './services';
import { staticFunctionWrapper } from './static-function-wrapper';

const utilsServiceInstance = new UtilsService(staticFunctionWrapper);
const npmServiceInstance = new NpmService(utilsServiceInstance);
const newModelServiceInstance = new NewModelService(utilsServiceInstance);

const typeScriptServiceInstance = new TypeScriptService(npmServiceInstance, utilsServiceInstance);

const jestServiceInstance = new JestService(npmServiceInstance, typeScriptServiceInstance);
const prettierServiceInstance = new PrettierService(npmServiceInstance, typeScriptServiceInstance);

const cliServiceInstance = new CLIService(
  jestServiceInstance,
  prettierServiceInstance,
  typeScriptServiceInstance,
  newModelServiceInstance,
  utilsServiceInstance
);

const args = process.argv.slice(2).map((arg) => arg.toLocaleLowerCase());
const app = new App(cliServiceInstance);
app.run(args);
