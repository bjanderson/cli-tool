#!/usr/bin/env node

import commandLineArgs, { CommandLineOptions, ParseOptions } from 'command-line-args';
import commandLineUsage, { OptionDefinition } from 'command-line-usage';
import { createNewModel } from './create-model';
import { createModelConfig } from './utils';

const optionDefinitions: OptionDefinition[] = [
  {
    alias: 'h',
    description: 'Show this help information',
    name: 'help',
    type: Boolean,
    typeLabel: 'boolean',
    defaultValue: false,
  },
  {
    alias: 'c',
    description: 'Create a model with tests using the given list of kabob-cased model names',
    lazyMultiple: true,
    multiple: true,
    name: 'create',
    type: String,
    typeLabel: 'string[]',
  },
  {
    alias: 'j',
    description: 'Generate JavaScript models instead of TypeScript',
    name: 'javascript-only',
    type: Boolean,
    typeLabel: 'boolean',
    defaultValue: false,
  },
];

const parseOptions: ParseOptions = {
  camelCase: true,
  partial: true,
  stopAtFirstUnknown: true,
};

const options: CommandLineOptions = commandLineArgs(optionDefinitions, parseOptions);

// console.log('options :', options);

if (Object.keys(options).length === 0 || options.help) {
  showUsage();
} else {
  if (shouldCreateModel(options)) {
    createModels(options);
  }
}

function showUsage(): void {
  const usage = commandLineUsage([
    {
      content: 'Generate JavaScript or TypeScript models.',
      header: 'Model Generator',
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
    {
      content: 'Project home: {underline https://github.com/LernatoLLC/model-generator}',
    },
  ]);
  console.log(usage);
}

function shouldCreateModel(input: CommandLineOptions): boolean {
  return input.create && input.create.length > 0;
}

function createModels(cliOptions: CommandLineOptions): void {
  const modelNames = cliOptions.create;
  const fileExt = cliOptions.javascriptOnly ? 'js' : 'ts';
  for (const name of modelNames) {
    const config = createModelConfig(name, fileExt);
    createNewModel(config);
  }

  console.log('\nModels generated successfully.\n');
}
