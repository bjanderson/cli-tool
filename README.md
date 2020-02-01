# @lernato/cli

A command line program for generating JavaScript and TypeScript projects and boilerplate code.

## Installation

To install the package:

    npm install -g @lernato/cli

## Usage:

Show these usage instructions

```
-h, --help
```

---

Create new things

```
lernato-cli new
```

Create a new model

```
lernato-cli new model <model-name>
```

```
options:

-f, --models-folder <folder/path>
specify the high-level folder that all models are stored in (default: src/models)

-j, --vanillajs
create files as vanilla JavaScript instead of TypeScript
```

Create a new service

```
lernato-cli new service <service-name>
```

```
options:

-f, --services-folder <folder/path>
specify the high-level folder that all services are stored in (default: src/services)

-j, --vanillajs
create files as vanilla JavaScript instead of TypeScript
```

Examples:

```
lernato-cli new model my-model

lernato-cli new service my-service -f path/to/my-services-folder -j
```

---

Initialize things in your project

```
lernato-cli init <option>
```

Initialize a vanilla node/npm project

```
lernato-cli init npm
```

Initialize a typescript project

```
lernato-cli init typescript
```

Add jest to a project for unit testing

```
lernato-cli init jest
```

Add prettier to a project for code formatting

```
lernato-cli init prettier
```

---
