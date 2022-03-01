import * as path from 'path';
import { CssMapping, HostCssMapping } from '../configuration';
import { ExtractedStyles } from '../stats';

export function toClassName(str: string): string {
  return toCapitalCase(toPropertyName(str));
}

export function toTagName(str: string): string {
  return toKebabCase(str);
}

export function getFilename(str: string): string {
  return path.parse(str).name;
}

export function convertStyles(extractedStyle: ExtractedStyles, cssMapping: CssMapping, hostCssMapping: HostCssMapping) {
  let hostStyle = {};

  Object.keys(hostCssMapping).forEach((cssProperty) => {
    const mapping = hostCssMapping[cssProperty].split(':');
    Object.keys(extractedStyle)
      .sort()
      .forEach((className) => {
        const cssRule = extractedStyle[className].find((item) => item[cssProperty]);
        if (cssRule && mapping.length === 1) {
          // Set default Value
          mapping[0] = cssRule[cssProperty];
        }
        hostStyle[cssProperty] = mapping;
      });
  });

  let hostCss =  `:host { ${Object.keys(hostStyle).map(cssProperty => {
    if (hostStyle[cssProperty].length > 1) {
      return `${cssProperty}: var(${hostStyle[cssProperty][1]}, ${hostStyle[cssProperty][0]})`
    }
    return `${cssProperty}: ${hostStyle[cssProperty][0]}`
  }).join('; ')}}`

  let styles = Object.keys(hostStyle).length > 0 ? [hostCss] : [];

  Object.keys(extractedStyle)
    .sort()
    .forEach((className) => {
      const classRules = extractedStyle[className]
        .map((rule) =>
          Object.keys(rule).reduce((str, cssProperty) => {
            if (!Object.keys(hostCssMapping).includes(cssProperty)) {
              return str + `${cssProperty} : ${mappingCssValue(cssProperty, rule[cssProperty], cssMapping)}`;
            }
            return str;
          }, '')
        )
        .filter((item) => !!item);

      if (classRules.length > 0) {
        styles.push(`.${className} { ${classRules.join('; ')} }`);
      }
    });

  return   styles.join('\n');
}

function mappingCssValue(type: string, value, mapping: CssMapping): string {
  for (const cssVariable of Object.keys(mapping)) {
    if (mapping[cssVariable].includes(`${type}:${value}`) || mapping[cssVariable].includes(`${type}:*`)) {
      return `var(${cssVariable}, ${value})`;
    }
  }

  return value;
}

function toPropertyName(s: string): string {
  return s
    .replace(/([^a-zA-Z0-9])+(.)?/g, (_, __, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/[^a-zA-Z\d]/g, '')
    .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

function toKebabCase(str: string): string {
  return toPropertyName(str)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Capitalizes the first letter of a string
 */
function toCapitalCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.substr(1);
}
