import { IStaticWrapper } from './static-wrapper';

export class UtilsService {
  constructor(private staticWrapper: IStaticWrapper) {}

  public createDirectory(path: string): void {
    try {
      this.staticWrapper.mkdirpSync(path);
    } catch (err) {
      console.error(`Failed to create directory: ${path}`);
      console.error(err);
      this.staticWrapper.process.exit(1);
    }
  }

  public createDirectoryIfNotExists(path: string): void {
    if (this.pathExists(path)) {
      console.error(`${path} already exists. Please enter a different name.`);
      this.staticWrapper.process.exit(1);
    }
    this.createDirectory(path);
  }

  public pathExists(path: string): boolean {
    return this.staticWrapper.existsSync(path);
  }

  public readFile(fileName: string): string {
    const fileContents = this.staticWrapper.readFileSync(fileName, { encoding: 'utf-8' });
    return fileContents;
  }

  public resolve(pathSegments: string[]): string {
    return this.staticWrapper.resolve(...pathSegments);
  }

  public writeFile(file: string, text: string): void {
    try {
      this.staticWrapper.writeFileSync(file, text, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Failed to write file: ${file}`);
      console.error(err);
      this.staticWrapper.process.exit(1);
    }
  }
}
