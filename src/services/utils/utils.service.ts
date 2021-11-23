import { FileExtension } from '../../enums';
import { IStaticFunctionWrapper } from '../../static-function-wrapper';

export class UtilsService {
  constructor(private staticFunctionWrapper: IStaticFunctionWrapper) {}

  createDirectory(path: string): void {
    try {
      this.staticFunctionWrapper.mkdirpSync(path);
    } catch (err) {
      console.error(`Failed to create directory: ${path}`);
      console.error(err);
      this.exit(1);
    }
  }

  createDirectoryIfNotExists(path: string): void {
    if (!this.pathExists(path)) {
      this.createDirectory(path);
    }
  }

  exit(code: number): void {
    this.staticFunctionWrapper.process.exit(code);
  }

  getFileAsJson(
    filename: string,
    message = `WARNING: Could not find ${filename} - make sure you are in your top-level project folder`
  ): any {
    if (this.pathExists(filename)) {
      try {
        const str = this.readFile(filename);
        return JSON.parse(str);
      } catch (err) {
        console.error(`ERROR: Could not read file ${filename}`);
        return {};
      }
    }
    console.warn(message);
    return {};
  }

  getFileExtension(args: string[]): FileExtension {
    const i = args.findIndex((arg) => arg === '-j' || arg === '--vanillajs');
    return i > -1 ? FileExtension.JS : FileExtension.TS;
  }

  pathExists(path: string): boolean {
    return this.staticFunctionWrapper.existsSync(path);
  }

  readFile(fileName: string): string {
    const fileContents = this.staticFunctionWrapper.readFileSync(fileName, { encoding: 'utf-8' });
    return fileContents;
  }

  resolve(pathSegments: string[]): string {
    return this.staticFunctionWrapper.resolve(...pathSegments);
  }

  writeFile(file: string, text: string): void {
    try {
      this.staticFunctionWrapper.writeFileSync(file, text, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Failed to write file: ${file}`);
      console.error(err);
      this.exit(1);
    }
  }

  writeJsonFile(filename: string, json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.writeFile(filename, str);
  }

  execute(command: string): void {
    try {
      this.staticFunctionWrapper.execSync(command);
    } catch (err) {
      console.error(`Error executing command: ${command}`);
      console.error(err);
    }
  }
}
