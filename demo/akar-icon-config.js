module.exports = {
  cssMapping: {
    '--wc-primary-color': ['color:currentColor'],
    '--wc-fill-color': ['fill:currentColor'],
    '--wc-stroke-color': ['stroke:currentColor', 'stroke:#000'],
    '--wc-stroke-width': ['stroke-width:*'],
    '--wc-stroke-linecap': ['stroke-linecap:*'],
    '--wc-stroke-linejoin': ['stroke-linejoin:*'],
    '--wc-fill-rule': ['fill-rule:*'],
  },
  hostCssMapping: {
    width: '24px:--wc-width',
    height: '24px:--wc-height',
    display: 'inline-block',
  },
};
