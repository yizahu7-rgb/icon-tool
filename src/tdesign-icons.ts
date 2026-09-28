export interface TDesignIcon {
  name: string;
  label: string;
  keywords: readonly string[];
  viewBox: string;
  body: string;
}

export const serializeTDesignIcon = (icon: TDesignIcon, size = 32) =>
  `<svg width="${size}" height="${size}" viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${icon.body
    .split('currentColor').join('black')
    .split('var(--td-icon-fill, white)').join('transparent')
    .split('var(--td-icon-fill, none)').join('transparent')
    .split('var(--td-icon-fill, transparent)').join('transparent')}\n</svg>`;
