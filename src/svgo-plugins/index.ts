import { Plugin } from 'svgo';

import { convertSvgAttributeToClass } from './convert-svg-attribute-to-class';

export function svgToWcPlugins(): Array<Plugin> {
  return [
    {
      name: 'convertStyleToAttrs',
    },

    convertSvgAttributeToClass,
  ];
}
