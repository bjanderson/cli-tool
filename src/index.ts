#!/usr/bin/env node

import { commandLineOptions, usageInstructions } from './command-line-option-definitions';
import { ModelGenerator } from './model-generator';
import { staticWrapper } from './static-wrapper';
import { UtilsService } from './utils.service';

const utilsService = new UtilsService(staticWrapper);
const modelGenerator = new ModelGenerator(utilsService);

if (Object.keys(commandLineOptions).length === 0 || commandLineOptions.help) {
  console.log(usageInstructions);
} else {
  modelGenerator.createModels(commandLineOptions);
}
