export interface ThemeColors {
  background: string;
  surface: string;
  elevatedSurface: string;
  text: string;
  secondaryText: string;
  tertiaryText: string;
  border: string;
  cardBorder: string;
  inputBackground: string;
  badgeBackground: string;
  accent: string;
  accentGradient: [string, string, ...string[]];
  storyGradient: [string, string, string];
  heartRed: string;
  tabActive: string;
  tabInactive: string;
  divider: string;
  positive: string;
  negative: string;
  warning: string;
  info: string;
}

export const semUiPalette = {
  primaryPink: '#FF0A78',
  deepMagenta: '#E1306C',
  secondaryPink: '#F72585',
  vividPurple: '#8A2BE2',
  deepPurple: '#7B2CBF',
  blueViolet: '#4F46E5',
  orange: '#FF8A00',
  yellowOrange: '#FFB347',
  red: '#FF0A78',
  green: '#2ECC71',
  grey: '#777982',
  black: '#101010',
  white: '#FFFFFF',
  brandRose: '#FF0A78',
};

export const lightColors: ThemeColors = {
  background: '#F7F8FA', // Main light screen background (Section 2)
  surface: '#FFFFFF', // Pure white surface (Section 2)
  elevatedSurface: '#F1F3F6', // Secondary light surface (Section 2)
  text: '#202024', // Primary text (Section 11)
  secondaryText: '#777982', // Secondary text (Section 11)
  tertiaryText: '#A0A2AA', // Muted labels (Section 11)
  border: '#E1E4E9', // Light neutral borders (Section 2)
  cardBorder: '#E9EBEF', // Subtle edge (Section 4)
  inputBackground: '#FFFFFF', // Search background (Section 6)
  badgeBackground: '#FF0A78', // Primary bright pink
  accent: '#FF0A78', // Primary bright pink (Section 7)
  accentGradient: ['#FF0A78', '#E1306C', '#8A2BE2', '#FF8A00', '#FFB347'],
  storyGradient: ['#FF0A78', '#E1306C', '#8A2BE2'],
  heartRed: '#FF0A78',
  tabActive: '#FF0A78', // Active accent (Section 12)
  tabInactive: '#A3A5AD', // Inactive icons (Section 12)
  divider: '#E5E7EB', // Subtle separators (Section 2)
  positive: '#2ECC71',
  negative: '#FF0A78',
  warning: '#FF8A00',
  info: '#4F46E5',
};

export const darkColors: ThemeColors = {
  background: '#101010', // Main dark screen background (Section 3)
  surface: '#151517', // Near-black surface (Section 3)
  elevatedSurface: '#29292D', // Dark elevated card surface (Section 3)
  text: '#F7F7F9', // Primary text (Section 11)
  secondaryText: '#C1C1C9', // Secondary text (Section 11)
  tertiaryText: '#92929B', // Muted text (Section 11)
  border: '#38383D', // Standard border (Section 13)
  cardBorder: '#38383D', // Subtle border (Section 4)
  inputBackground: '#303036', // Search background (Section 6)
  badgeBackground: '#FF0A78',
  accent: '#FF0A78', // Primary bright pink (Section 7)
  accentGradient: ['#FF0A78', '#E1306C', '#8A2BE2', '#FF8A00', '#FFB347'],
  storyGradient: ['#FF0A78', '#E1306C', '#8A2BE2'],
  heartRed: '#FF0A78',
  tabActive: '#FF0A78', // Active accent (Section 12)
  tabInactive: '#C0C0C8', // Inactive icons (Section 12)
  divider: '#303036', // Subtle separator (Section 13)
  positive: '#2ECC71',
  negative: '#FF0A78',
  warning: '#FF8A00',
  info: '#4F46E5',
};

export const shadowGradients = {
  mainFeed: ['#FF0A78', '#E1306C', '#8A2BE2', '#FF8A00'],
  softPastel: ['#FF0A78', '#E1306C', '#8A2BE2'],
  storyRing: ['#FF0A78', '#E1306C', '#8A2BE2', '#4F46E5'],
  primaryMulti: ['#FF0A78', '#E1306C', '#8A2BE2', '#FF8A00', '#FFB347'],
  categoryTV: ['#FF0A78', '#FF8A00'],
  categoryShop: ['#4F46E5', '#3B82F6'],
  categoryTravel: ['#8A2BE2', '#7B2CBF'],
  categoryFitness: ['#FF0A78', '#E1306C'],
  deepMoody: ['#29292D', '#151517', '#101010'],
  tealCyan: ['#4F46E5', '#8A2BE2'],
  warmBronze: ['#FF8A00', '#FF0A78', '#E1306C'],
};

export const themeRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  card: 26,
  full: 9999,
};

export const themeSpacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};
