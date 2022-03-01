import { OptimizedSvg } from 'svgo';
import { Configuration } from './configuration';
import { Stats } from './stats';
import Handlebars from 'handlebars';
import { convertStyles, getFilename, toClassName, toTagName } from './utils/utils';

const templateStr = `
import {LitElement, svg, css} from 'lit';

export class {{className}} extends LitElement {
    static styles = css\`
{{{styles}}}
\`

    constructor() {
        super();
    }

    render() {
        return svg\`{{{svg}}}\`
    }
}

customElements.define('{{tagPrefix}}-{{tagName}}', {{className}});
`;

export function generator(filePath: string, optimizedSvg: OptimizedSvg, config: Configuration): string {
  const styles = convertStyles(Stats.getStyles(filePath), config.cssMapping, config.hostCssMapping);
  let fileName = getFilename(filePath);
  
  if (config.fileNameTransform) {
    fileName = config.fileNameTransform(fileName);
  }

  const tagName = toTagName(fileName);
  const className = toClassName(fileName);
  let template: HandlebarsTemplateDelegate;
  if (config.wcTemplate) {
    template = Handlebars.compile(config.wcTemplate);
  } else {
    template = Handlebars.compile(templateStr);
  }
  return template({ styles, svg: optimizedSvg.data, tagName, className, ...config });
}
