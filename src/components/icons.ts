/** SVG path data (24×24, stroked) shared by the sidebar and empty states. */
export const ICONS = {
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  contacts: 'M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 8a5 5 0 0 0-4-4.9M16 3.1a4 4 0 0 1 0 7.8',
  pipeline: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v6h-4z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-5-5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
} as const;

export type IconName = keyof typeof ICONS;
