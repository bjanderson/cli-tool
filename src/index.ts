#!/usr/bin/env node

import { App } from './app';
import {
  InitJestService,
  InitPrettierService,
  InitTypeScriptService,
  NewModelService,
  UtilsService,
} from './services';
import { staticFunctionWrapper } from './static-function-wrapper';

const utilsServiceInstance = new UtilsService(staticFunctionWrapper);
const initJestServiceInstance = new InitJestService(utilsServiceInstance);
const initPrettierServiceInstance = new InitPrettierService(utilsServiceInstance);
const initTypeScriptServiceInstance = new InitTypeScriptService(utilsServiceInstance);
const newModelServiceInstance = new NewModelService(utilsServiceInstance);

const app = new App(
  initJestServiceInstance,
  initPrettierServiceInstance,
  initTypeScriptServiceInstance,
  newModelServiceInstance
);
app.run();
