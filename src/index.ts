#!/usr/bin/env node

import { App } from './app';
import {
  JestService,
  ModelService,
  NpmService,
  PrettierService,
  ServiceService,
  TypeScriptService,
  UtilsService,
} from './services';
import { staticFunctionWrapper } from './static-function-wrapper';
import { EslintService } from './services/eslint';

const utilsServiceInstance = new UtilsService(staticFunctionWrapper);
const npmServiceInstance = new NpmService(utilsServiceInstance);
const modelServiceInstance = new ModelService(utilsServiceInstance);
const serviceServiceInstance = new ServiceService(utilsServiceInstance);

const eslintServiceInstance = new EslintService(npmServiceInstance, utilsServiceInstance);

const typeScriptServiceInstance = new TypeScriptService(npmServiceInstance, utilsServiceInstance);

const jestServiceInstance = new JestService(
  npmServiceInstance,
  typeScriptServiceInstance,
  utilsServiceInstance
);
const prettierServiceInstance = new PrettierService(npmServiceInstance, utilsServiceInstance);

const app = new App(
  eslintServiceInstance,
  jestServiceInstance,
  modelServiceInstance,
  npmServiceInstance,
  prettierServiceInstance,
  serviceServiceInstance,
  typeScriptServiceInstance,
  utilsServiceInstance
);

const args = process.argv.slice(2).map((arg) => arg.toLocaleLowerCase());

app.run(args);
