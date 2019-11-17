#!/usr/bin/env node

import commandLineArgs, {
  CommandLineOptions,
  OptionDefinition,
  ParseOptions,
} from 'command-line-args';
import commandLineUsage from 'command-line-usage';

interface IMyOptionDefinition extends OptionDefinition {
  description?: string;
}

const optionDefinitions: IMyOptionDefinition[] = [
  {
    alias: 'h',
    description: 'Show this help information',
    name: 'help',
    type: Boolean,
  },
  {
    alias: 'm',
    description:
      'Create a model with tests using the given list of kabob-cased folder names',
    lazyMultiple: true,
    multiple: true,
    name: 'create-model',
    type: String,
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

console.log('options :', options);

if (options.help) {
  showUsage();
} else {
  if (shouldCreateModel(options)) {
    createModels(options.createModel);
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
  return input.createModel && input.createModel.length > 0;
}

function createModels(modelNames: string[]): void {
  console.log('createModels modelNames :', modelNames);
}
