import { program } from 'commander';
import { cosmiconfigSync } from 'cosmiconfig';

import * as packgeJSON from '../package.json';
import { Configuration, DEFAULT_CONFIG } from './configuration';
import { convert } from './convert';
import { Logger } from './utils/logger';
import { loadConfig } from 'svgo';

function setupCommander() {
  const collect = (value, previous = []) => previous.concat([value]);
  program
    .version(packgeJSON.version)
    .option('--config <string>', 'path to the configuration file')
    .option('--tagPrefix <string>', 'prefix for the generated wc tag')
    .option('--cssPrefix <string>', 'prefix for the generated css variables')
    .option('-s --srcFiles <value>', 'name of the source directory', collect)
    .option('-o --outputDirectory <string>', 'name of the output directory')
    .option('--verbose <boolean>', 'Specifies if a verbose log message should be printed or not')
    .parse(process.argv);
}

(async () => {
  setupCommander();
  Logger.printWelcomeMessage();
  let opts = program.opts<{ config?: string; tagPrefix: string; cssPrefix: string; srcFiles: string[]; outputDirectory: string, verbose?: boolean }>();
  Logger.changeVisibility(opts.verbose)

  const explorerSync = cosmiconfigSync(packgeJSON.name);
  const cosmiConfigResult = opts.config ? explorerSync.load(opts.config) : explorerSync.search();
  cosmiConfigResult ? Logger.verboseInfo(`Configuration found under: ${cosmiConfigResult.filepath}`) : Logger.verboseInfo('No config found');

  let config: Configuration = { ...DEFAULT_CONFIG};

  if (cosmiConfigResult) {
    config = {...config, ...cosmiConfigResult.config}
  }
  let svgoConfig = await loadConfig()
  if (!svgoConfig) {
    svgoConfig = DEFAULT_CONFIG.svgoConfig;
  }
  config = {...config, ...opts, svgoConfig};
  Logger.verboseInfo(`svg-to-wc configuration: \n ${JSON.stringify(config, null, 2)}`);

  await convert(config)
  Logger.info('Convert completed !!!')
})();
