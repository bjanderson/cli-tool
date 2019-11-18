import commandLineArgs, { CommandLineOptions, ParseOptions } from 'command-line-args';
import commandLineUsage, { OptionDefinition } from 'command-line-usage';

export const optionDefinitions: OptionDefinition[] = [
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
    name: 'vanilla-javascript',
    type: Boolean,
    typeLabel: 'boolean',
    defaultValue: false,
  },
];

export const parseOptions: ParseOptions = {
  camelCase: true,
  partial: true,
  stopAtFirstUnknown: true,
};

export const commandLineOptions: CommandLineOptions = commandLineArgs(
  optionDefinitions,
  parseOptions
);

export const usageInstructions = commandLineUsage([
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
