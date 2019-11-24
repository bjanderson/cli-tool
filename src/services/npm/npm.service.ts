import { UtilsService } from '../utils';

export class NpmService {
  public packageJsonFile = this.utilsService.resolve(['package.json']);
  public gitignoreFile = this.utilsService.resolve(['.gitignore']);
  public editorconfigFile = this.utilsService.resolve(['.editorconfig']);

  constructor(private utilsService: UtilsService) {}

  init(): void {
    if (!this.hasPackageJson()) {
      this.utilsService.execute('npm init -y');
      this.initGitIgnore();
      this.initEditorConfig();
      this.cleanPackageJson();
    }
  }

  installPackages(packages: string[]): void {
    const command = `npm i -D --ignore-scripts ${packages.join(' ')}`;
    this.utilsService.execute(command);
  }

  hasPackageJson(): boolean {
    return this.utilsService.pathExists(this.packageJsonFile);
  }

  hasGitIgnore(): boolean {
    return this.utilsService.pathExists(this.gitignoreFile);
  }

  hasEditorConfig(): boolean {
    return this.utilsService.pathExists(this.editorconfigFile);
  }

  initGitIgnore(): void {
    if (!this.hasGitIgnore()) {
      const text = `
coverage/
dist/
node_modules/
tmp/

*.tar
*.gz
*.bz2
*.zip
`;
      this.utilsService.writeFile(this.gitignoreFile, text);
    }
  }

  initEditorConfig(): void {
    if (!this.hasEditorConfig()) {
      const text = `
root = true

[*]
end_of_line = lf
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[{*.md,*.json}]
max_line_length = null
`;
      this.utilsService.writeFile(this.editorconfigFile, text);
    }
  }

  getPackageJson(): any {
    if (!this.utilsService.pathExists(this.packageJsonFile)) {
      console.error(
        'Error: Could not find package.json - make sure you are in your top-level project folder'
      );
      this.utilsService.exit(1);
    }
    const str = this.utilsService.readFile(this.packageJsonFile);
    const json = JSON.parse(str);
    return json;
  }

  writePackageJson(json: any): void {
    const str = JSON.stringify(json, null, 2);
    this.utilsService.writeFile(this.packageJsonFile, str);
  }

  cleanPackageJson(): void {
    const json = this.getPackageJson();
    const obj = {
      name: json.name,
      version: json.version,
      license: json.license,
      author: json.author,
      private: true,
      scripts: json.scripts,
    };
    this.writePackageJson(obj);
  }
}
