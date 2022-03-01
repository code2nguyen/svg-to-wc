import { colors } from './color';

export class Logger {
  private static verbose = false;

  public static changeVisibility(verbose: boolean) {
    Logger.verbose = verbose;
  }

  static printWelcomeMessage() {
    console.log(`${colors.blueBright('==========================================================')}`);
    console.log(`\t\t${colors.cyan('SVG To Web Component')}`);
    console.log(`${colors.blueBright('==========================================================')}`);
  }

  static info(message: string) {
    console.log(message);
  }

  static error(message: string) {
    console.error(message);
  }

  static verboseInfo(message: string) {
    if (Logger.verbose) {
      console.log(`${colors.yellow(message)}`);
    }
  }
}
