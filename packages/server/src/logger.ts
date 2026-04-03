import { consola } from "consola";

export class Logger {
  private logger: ReturnType<typeof consola.withTag>;
  private static _startTime = Date.now();

  constructor(context: string) {
    this.logger = consola.withTag(context);
  }

  static resetTimer() {
    Logger._startTime = Date.now();
  }

  static elapsed() {
    return Date.now() - Logger._startTime;
  }

  log(message: string, ms?: number) {
    const suffix = ms !== undefined ? ` +${ms}ms` : "";
    this.logger.info(`${message}${suffix}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
