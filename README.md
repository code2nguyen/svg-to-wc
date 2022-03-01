# SVG To Web Components
`svg-to-wc` is a tool that converts SVG file to Web Component.

## Usage

### Command line
To know more about availabled parameters. Run help command
```
    npx  svg-to-wc --help
```
To have more flexibilities, you should create your own configuration. 

### Configuration

Configuration interface can be found [here](./src/configuration.ts)

```typescript
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
```

Those files can be written in `json`, `yaml`, `yml`, `js` (CommonJS module). `svg-to-wc` uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to load configuration. You can checkout the documentation of `cosmiconfig` to know more.

`svg-to-wc`uses [svgo](https://github.com/svg/svgo) to optimizer SVG with a built in custom plugins. You can customize `svgo` config by adding `svgo.config.js` file into the root folder. In this case, you must include all `svg-to-wc` plugins.

```js
    const svgToWcPlugins = require('svg-to-wc').svgoPlugins;

    module.exports = {
        plugins: [
            ...svgToWcPlugins()
        ],
    };
```


### cssMapping
`cssMapping` is an object you can put in configuration file. This is a mapping table will mapping your style to css variables

The format of this object is `[CSS_VARIABLE]: List of css property pattern`, 

Example, map all fill:currentColor, and color:currenColor to wc-primary-color 
and map fill:#fff to wc-background-color with fallback color is fff

```
    'wc-primary-color': ['fill:currentColor', 'color:currentColor'],
    'wc-background-color': ['fill:#fff'],
```

### hostCssMapping
Define mapping for `:host` class. Format of object: `[CSS_PROPERTY]: Mapping pattern`. Mapping pattern is `[DEFAULT_VALUE]:[CSS_VARIABLE]`, note that, DEFAULT_VALUE will be overrided by SVG atribute. Example if SVG has `width=120`, so default value Width in hostCssMapping will be overrided to 120px.
Example

```
  hostCssMapping: {
    'width': '24px:--wc-width-color',
    'height': '24px:--wc-height-color',
    'display': 'inline-block'
  }
```

The default mapping can be found [here](./src/configuration.ts)

### generator and generator template
`svg-to-wc` provide a default web component generator with two templates. __lit-web-component__ and __standard-web-component__

You can create your own template then change it with `wcTemplate` in config file in format string.

You can also create your own generate then change it wih `generator` in config file.


## References:
Following the resources I consult on building this library

- https://dev.to/johntheo/lazy-loading-svg-icons-using-web-components-3foi
- https://github.com/svg/svgo