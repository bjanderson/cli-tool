import { FileExtension } from '../../enums';
import { IStaticFunctionWrapper } from '../../static-function-wrapper';

export class UtilsService {
  constructor(private staticFunctionWrapper: IStaticFunctionWrapper) {}

  getFileExtension(args: string[]): FileExtension {
    const i = args.findIndex((arg) => arg === '-j' || arg === '--vanillajs');
    return i > -1 ? FileExtension.JS : FileExtension.TS;
  }

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
    if (this.pathExists(path)) {
      console.error(`${path} already exists. Please enter a different name.`);
      this.exit(1);
    }
    this.createDirectory(path);
  }

  exit(code: number): void {
    this.staticFunctionWrapper.process.exit(code);
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

  execute(command: string): void {
    try {
      this.staticFunctionWrapper.execSync(command);
    } catch (err) {
      console.error(`Error executing command: ${command}`);
      console.error(err);
    }
  }
}
