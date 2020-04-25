# cli-tool

A command line program for generating JavaScript and TypeScript projects and boilerplate code.

## Usage:

Show these usage instructions

```
-h, --help
```

---

Create new things

```
cli-tool new
```

Create a new model

```
cli-tool new model <model-name>
```

Options:

```
-f, --models-folder <folder/path>
specify the high-level folder that all models are stored in (default: src/models)

-j, --vanillajs
create files as vanilla JavaScript instead of TypeScript
```

Create a new service

```
cli-tool new service <service-name>
```

Options:

```
-f, --services-folder <folder/path>
specify the high-level folder that all services are stored in (default: src/services)

-j, --vanillajs
create files as vanilla JavaScript instead of TypeScript
```

Examples:

```
cli-tool new model my-model

cli-tool new service my-service -f path/to/my-services-folder -j
```

---

Initialize things in your project

```
cli-tool init <option>
```

Initialize a vanilla node/npm project

```
cli-tool init npm
```

Initialize a typescript project

```
cli-tool init typescript
```

Add jest to a project for unit testing

```
cli-tool init jest
```

Add prettier to a project for code formatting

```
cli-tool init prettier
```

---
