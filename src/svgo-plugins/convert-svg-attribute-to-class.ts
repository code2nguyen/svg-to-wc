import { CustomPlugin } from 'svgo';
import { Stats } from '../stats';

function convertFn(ast, params, info) {
  const attrs: string[] = params.attrs || [
    'fill',
    'stroke-linecap',
    'stroke-linejoin',
    'fill-rule',
    'stroke',
    'stroke-width',
    'width',
    'height',
    'color',
    'fill-opacity',
    'fill-rule',
  ];
  const cssStyleRules = [];
  for (const attr of attrs) {
    if (ast.attributes[attr]) {
      cssStyleRules.push({ [attr]: `${toCssProperty(attr, ast.attributes[attr])}` });
      delete ast.attributes[attr];
    }
  }
  if (cssStyleRules.length > 0) {
    const stats = Stats.getStyles(info.path);
    const className = 'class-' + Object.keys(stats).length;
    stats[className] = cssStyleRules;
    ast.attributes.class = className;
  }

  // Sets the default attributes for an SVG element to be used as an icon.
  if (ast.name === 'svg') {
    ast.attributes.fit = '';
    delete ast.attributes.xmlns;
    ast.attributes.height = '100%';
    ast.attributes.width = '100%';
    ast.attributes.preserveAspectRatio = 'xMidYMid meet';
    ast.attributes.focusable = 'false';
  }
}

function toCssProperty(attr: string, value: string) {
  const nbr = Number(value);
  if (!isNaN(nbr) && attr !== 'fill-opacity') return `${value}px`;

  return value;
}

export const convertSvgAttributeToClass: CustomPlugin = {
  type: 'perItemReverse',
  name: 'convertSvgAttributeToClass',
  fn: convertFn,
};
