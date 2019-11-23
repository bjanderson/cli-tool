import { IStaticFunctionWrapper } from '../../static-function-wrapper';

export class UtilsService {
  constructor(private staticFunctionWrapper: IStaticFunctionWrapper) {}

  public createDirectory(path: string): void {
    try {
      this.staticFunctionWrapper.mkdirpSync(path);
    } catch (err) {
      console.error(`Failed to create directory: ${path}`);
      console.error(err);
      this.staticFunctionWrapper.process.exit(1);
    }
  }

  public createDirectoryIfNotExists(path: string): void {
    if (this.pathExists(path)) {
      console.error(`${path} already exists. Please enter a different name.`);
      this.staticFunctionWrapper.process.exit(1);
    }
    this.createDirectory(path);
  }

  public pathExists(path: string): boolean {
    return this.staticFunctionWrapper.existsSync(path);
  }

  public readFile(fileName: string): string {
    const fileContents = this.staticFunctionWrapper.readFileSync(fileName, { encoding: 'utf-8' });
    return fileContents;
  }

  public resolve(pathSegments: string[]): string {
    return this.staticFunctionWrapper.resolve(...pathSegments);
  }

  public writeFile(file: string, text: string): void {
    try {
      this.staticFunctionWrapper.writeFileSync(file, text, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Failed to write file: ${file}`);
      console.error(err);
      this.staticFunctionWrapper.process.exit(1);
    }
  }
}
