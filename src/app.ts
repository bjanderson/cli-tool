import { CLIService } from './services';

export class App {
  constructor(private cliService: CLIService) {}

  run(args: string[]): void {
    this.cliService.run(args);
  }
}
