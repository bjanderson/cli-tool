import { camelFromKabobOrPascal, lowerize, pascalFromKabobOrCamel } from '@bj.anderson/utils';
import { FileExtension } from '../../enums';
import { ServiceConfig } from '../../models';
import { UtilsService } from '../utils';

export class ServiceService {
  constructor(private utilsService: UtilsService) {}

  createService(args: string[]): void {
    const serviceName = args.shift();
    if (serviceName.startsWith('-')) {
      console.error('Invalid service name');
      this.utilsService.exit(1);
    }
    const fileExt = this.utilsService.getFileExtension(args);
    const servicesFolder = this.getServicesFolder(args);
    const serviceConfig = this.createServiceConfig(serviceName, fileExt, servicesFolder);
    this.createNewService(serviceConfig);
  }

  getServicesFolder(args: string[]): string {
    const i = args.findIndex((arg) => arg === '-f' || arg === '--services-folder');
    return i < 0 ? ServiceConfig.defaultServicesFolder : args[i + 1];
  }

  createServiceConfig(
    name: string,
    fileExt: FileExtension,
    servicesLocation: string
  ): ServiceConfig {
    const camel = camelFromKabobOrPascal(name);
    const kabob = lowerize(name);
    const pascal = pascalFromKabobOrCamel(name);
    const servicesFolder = this.utilsService.resolve(servicesLocation.split('/'));
    const servicesIndexFile = this.utilsService.resolve([servicesFolder, `index.${fileExt}`]);
    const folder = this.utilsService.resolve([servicesFolder, kabob]);
    const file = this.utilsService.resolve([folder, `${kabob}.service.${fileExt}`]);
    const spec = this.utilsService.resolve([folder, `${kabob}.service.spec.${fileExt}`]);
    const index = this.utilsService.resolve([folder, `index.${fileExt}`]);

    const config = new ServiceConfig({
      camel,
      file,
      fileExt,
      folder,
      index,
      kabob,
      servicesFolder,
      servicesIndexFile,
      name,
      pascal,
      spec,
    });

    console.log('\nconfig :', config, '\n');

    return config;
  }

  createNewService(config: ServiceConfig): void {
    this.utilsService.createDirectoryIfNotExists(config.folder);
    this.createServicesIndexIfNotExists(config);
    if (config.fileExt === FileExtension.JS) {
      this.createJSService(config);
      this.createJSServiceSpec(config);
    } else {
      this.createTSService(config);
      this.createTSServiceSpec(config);
    }
    this.createServiceIndex(config);
    this.updateServicesIndex(config);
  }

  createJSService(config: ServiceConfig): void {
    const text = `export class ${config.pascal}Service {
  constructor() {}
}
`;
    this.utilsService.writeFile(config.file, text);
  }

  createTSService(config: ServiceConfig): void {
    const text = `export class ${config.pascal}Service {
  constructor() {}
}
`;
    this.utilsService.writeFile(config.file, text);
  }

  createJSServiceSpec(config: ServiceConfig): void {
    const text = `import { ${config.pascal}Service } from './${config.kabob}.service';

let service;
function init() {
  service = new ${config.pascal}Service();
}

describe('${config.pascal}Service', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
`;
    this.utilsService.writeFile(config.spec, text);
  }

  createTSServiceSpec(config: ServiceConfig): void {
    const text = `import { ${config.pascal}Service } from './${config.kabob}.service';

let service: any;
function init() {
  service = new ${config.pascal}Service();
}

describe('${config.pascal}Service', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('is initializes', () => {
      expect(service).toBeDefined();
    });
  });
});
`;
    this.utilsService.writeFile(config.spec, text);
  }

  createServiceIndex(config: ServiceConfig): void {
    const text = `export * from './${config.kabob}.service';
`;
    this.utilsService.writeFile(config.index, text);
  }

  updateServicesIndex(config: ServiceConfig): void {
    const indexContents = this.utilsService.readFile(config.servicesIndexFile).trim();
    const parts = indexContents.split('\n');
    const servicesExportText = `export * from './${config.kabob}';`;
    if (!parts.includes(servicesExportText)) {
      parts.push(servicesExportText);
    }
    parts.sort((a: string, b: string) => a.localeCompare(b));
    const text = `${parts.join('\n').trim()}\n`;
    this.utilsService.writeFile(config.servicesIndexFile, text);
  }

  createServicesIndexIfNotExists(config: ServiceConfig): void {
    if (!this.utilsService.pathExists(config.servicesIndexFile)) {
      const text = '';
      this.utilsService.createDirectory(config.servicesFolder);
      this.utilsService.writeFile(config.servicesIndexFile, text);
    }
  }
}
