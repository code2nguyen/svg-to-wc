export interface ExtractedStyles {
  [key: string]: Array<{
    [cssProperty: string]: string;
  }>;
}

export class Stats {
  private static styles = new Map<string, ExtractedStyles>();

  static getStyles(path: string) {
    if (!Stats.styles.has(path)) {
      Stats.styles.set(path, {});
    }
    return Stats.styles.get(path);
  }
}
