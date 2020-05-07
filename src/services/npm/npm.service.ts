import { FileExtension, NpmDependencyType } from '../../enums';
import { UtilsService } from '../utils';

export class NpmService {
  public packageJsonFile = this.utilsService.resolve(['package.json']);
  public gitignoreFile = this.utilsService.resolve(['.gitignore']);
  public editorconfigFile = this.utilsService.resolve(['.editorconfig']);
  public jsconfig = this.utilsService.resolve(['jsconfig.json']);

  constructor(private utilsService: UtilsService) {}

  init(args: string[]): void {
    if (!this.hasPackageJson()) {
      this.utilsService.execute('npm init -y');
      this.initGitIgnore();
      this.initEditorConfig();
      this.cleanPackageJson();
      const fileExtension = this.utilsService.getFileExtension(args);
      this.createIndexJs(fileExtension);
      const isVanillaJs = fileExtension === FileExtension.JS;
      if (isVanillaJs) {
        this.createJSConfig();
      }
    }
  }

  installPackages(packages: string[], packageType: NpmDependencyType): void {
    const type = packageType === NpmDependencyType.DEPENDENCY ? '-S' : '-D';
    const command = `npm i ${type} --ignore-scripts ${packages.join(' ')}`;
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

*.crt
*.csr
*.key
*.p12
*.srl
*.pub
`;
      this.utilsService.writeFile(this.gitignoreFile, text);
    }
  }

  initEditorConfig(): void {
    if (!this.hasEditorConfig()) {
      const text = `
# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
max_line_length = 100
quote_type = single
spaces_around_brackets = indside
spaces_around_operators = true
trim_trailing_whitespace = true

[{*.md,*.json}]
max_line_length = off

# The JSON files contain newlines inconsistently
[*.json]
insert_final_newline = ignore

[*.md]
trim_trailing_whitespace = false

# Minified JavaScript files shouldn't be changed
[**.min.js]
indent_style = ignore
insert_final_newline = ignore
`;
      this.utilsService.writeFile(this.editorconfigFile, text);
    }
  }

  getPackageJson(): any {
    return this.utilsService.getFileAsJson(this.packageJsonFile);
  }

  writePackageJson(json: any): void {
    this.utilsService.writeJsonFile(this.packageJsonFile, json);
  }

  cleanPackageJson(): void {
    const json = this.getPackageJson();
    const obj = {
      name: json.name,
      version: json.version,
      license: json.license,
      author: json.author,
      private: true,
      scripts: { start: 'node src/index.js' },
    };
    this.writePackageJson(obj);
  }

  createIndexJs(fileExtension: FileExtension): void {
    const src = this.utilsService.resolve(['src']);
    this.utilsService.createDirectoryIfNotExists(src);
    const indexJs = this.utilsService.resolve(['src', `index.${fileExtension}`]);
    this.utilsService.writeFile(indexJs, `console.log('new npm project')`);
  }

  createJSConfig(): void {
    const text = `
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6"
  },
  "include": ["src/**/*"]
}
`;
    this.utilsService.writeFile(this.jsconfig, text);
  }
}
