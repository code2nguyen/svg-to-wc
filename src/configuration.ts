import { OptimizedSvg, OptimizeOptions } from 'svgo';
import { svgToWcPlugins } from './svgo-plugins';

export interface CssMapping {
  [cssVariable: string]: string | string[];
}


export interface HostCssMapping {
  [cssProperty: string]: string ;
}
export interface Configuration {
  outputDirectory: string;
  tagPrefix: string;
  srcFiles: string[];
  svgoConfig: OptimizeOptions;
  cssMapping: CssMapping;
  hostCssMapping: HostCssMapping;
  wcTemplate?: string;
  fileNameTransform?: (filename: string) => string,
  generator?: (filePath: string, optimizedSvg: OptimizedSvg, config: Configuration) =>  string
}

export const DEFAULT_CONFIG: Configuration = {
  outputDirectory: './dist/svg-wc',
  tagPrefix: 'wc',
  srcFiles: ['*.svg'],
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
      },
      ...svgToWcPlugins(),
    ],
  },
  cssMapping: {
    '--wc-primary-color': ['color:currentColor'],
    '--wc-fill-color': ['fill:currentColor'],
    '--wc-stroke-color': ['stroke:currentColor'],
    '--wc-stroke-width': ['stroke-width:*'],
    '--wc-stroke-linecap': ['stroke-linecap:*'],
    '--wc-stroke-linejoin': ['stroke-linejoin:*'],
    '--wc-fill-rule': ['fill-rule:*']
  },
  hostCssMapping: {
    'width': '24px:--wc-width',
    'height': '24px:--wc-height',
    'display': 'inline-block'
  }
};
