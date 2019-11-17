#!/usr/bin/env node

import commandLineArgs, {
  CommandLineOptions,
  ParseOptions,
} from 'command-line-args';
import commandLineUsage, { OptionDefinition } from 'command-line-usage';
import { createModelConfig, readFile } from './utils';

const optionDefinitions: OptionDefinition[] = [
  {
    alias: 'h',
    description: 'Show this help information',
    name: 'help',
    type: Boolean,
    typeLabel: 'boolean',
  },
  {
    alias: 'c',
    description:
      'Create a model with tests using the given list of kabob-cased folder names',
    lazyMultiple: true,
    multiple: true,
    name: 'create',
    type: String,
    typeLabel: 'string[]',
  },
];

const parseOptions: ParseOptions = {
  camelCase: true,
  partial: true,
  stopAtFirstUnknown: true,
};

const options: CommandLineOptions = commandLineArgs(
  optionDefinitions,
  parseOptions,
);

// console.log('options :', options);

if (Object.keys(options).length === 0 || options.help) {
  showUsage();
} else {
  if (shouldCreateModel(options)) {
    createModels(options.create);
  }
}

function showUsage(): void {
  const usage = commandLineUsage([
    {
      content: 'A simple example demonstrating typical usage.',
      header: 'Typical Example',
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
    {
      content: 'Project home: {underline https://github.com/me/example}',
    },
  ]);
  console.log(usage);
}

function shouldCreateModel(input: CommandLineOptions): boolean {
  return input.create && input.create.length > 0;
}

function createModels(modelNames: string[]): void {
  console.log('create modelNames :', modelNames);
  for (const name of modelNames) {
    const config = createModelConfig(name);
    readFile(config.modelsIndexFile);
    // createDirectoryIfNotExists(config.folder);
  }
}
