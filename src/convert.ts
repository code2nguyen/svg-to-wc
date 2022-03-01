import { filter, from, map } from 'rxjs';
import { Configuration } from './configuration';
import * as fs from 'fs';
import { getFilePaths } from './utils/files';
import { optimize, OptimizedSvg } from 'svgo';
import { generator as defaultGenerator } from './generator';
import { Logger } from './utils/logger';
import { colors } from './utils/color';
import * as path from 'path';
import { getFilename } from './utils/utils';
import { Stats } from './stats';

export async function convert(config: Configuration) {
  const sourceFilePaths = await getFilePaths(config.srcFiles);

  from(sourceFilePaths)
    .pipe(
      // load raw data
      map((filePath) => {
        const data = fs.readFileSync(filePath, { encoding: 'utf8' });
        return [filePath, data.replace(/\r?\n|\r/g, ' ')];
      }),
      // svgo
      map(([filePath, rawSvg]) => {
        const optimizedSvg = optimize(rawSvg, { path: filePath, ...config.svgoConfig });
        if (optimizedSvg.error) {
          return null;
        }
        return { filePath, optimizedSvg: optimizedSvg as OptimizedSvg };
      }),
      filter((data) => !!data),
      map(({ filePath, optimizedSvg }) => {
        const generator = config.generator || defaultGenerator;
        return { filePath, optimizedSvg, wcContent: generator(filePath, optimizedSvg, config) };
      })
    )
    .subscribe(({ filePath, optimizedSvg, wcContent }) => {
      const outputPath = path.join(config.outputDirectory, getFilename(filePath) + '.js');
      Logger.info(colors.blue('Generated WC for ') + colors.greenBright(filePath));

      Logger.verboseInfo('Extracted styles');
      Logger.verboseInfo(JSON.stringify(Stats.getStyles(filePath), null, 2));
      Logger.verboseInfo('WC Content');
      Logger.verboseInfo(wcContent);

      if (!fs.existsSync(config.outputDirectory)) {
        fs.mkdirSync(config.outputDirectory, { recursive: true });
      }
      fs.writeFileSync(outputPath, wcContent);
    });

  return '';
}
