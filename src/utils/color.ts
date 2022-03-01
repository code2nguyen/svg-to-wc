import * as ansiColors from 'ansi-colors';
type AnsiColors = typeof ansiColors;

const colors = (ansiColors as AnsiColors & { create: () => AnsiColors }).create();

export { colors };
