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
  red: '#DB2828',
  orange: '#F2711C',
  yellow: '#FBBD08',
  olive: '#B5CC18',
  green: '#21BA45',
  teal: '#00B5AD',
  blue: '#2185D0',
  violet: '#6435C9',
  purple: '#A333C8',
  pink: '#E03997',
  brown: '#A5673F',
  grey: '#767676',
  black: '#1B1C1D',
  brandRose: '#E1306C',
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  elevatedSurface: '#F7F8FA',
  text: '#1B1C1D', // Sem UI Charcoal text (14.5:1 contrast against #FFFFFF - WCAG AAA)
  secondaryText: '#555963', // High legibility secondary (6.2:1 contrast - WCAG AA)
  tertiaryText: '#767676', // Sem UI Grey (4.54:1 contrast - WCAG AA compliant >= 4.5:1)
  border: '#E0E1E2', // Sem UI standard border
  cardBorder: '#D4D4D5', // Sem UI segment border
  inputBackground: '#F4F5F7',
  badgeBackground: '#DB2828', // Sem UI Negative Red
  accent: '#E1306C', // Brand signature rose
  accentGradient: ['#E1306C', '#C13584', '#833AB4'],
  storyGradient: ['#E1306C', '#F2711C', '#FBBD08'],
  heartRed: '#DB2828',
  tabActive: '#1B1C1D',
  tabInactive: '#767676',
  divider: '#EDEDED',
  positive: '#21BA45',
  negative: '#DB2828',
  warning: '#F2711C',
  info: '#00B5AD',
};

export const darkColors: ThemeColors = {
  background: '#12131A', // Sem UI Inverted deep obsidian
  surface: '#1A1B24', // Sem UI Inverted card surface
  elevatedSurface: '#222430', // Sem UI Inverted elevated segment
  text: '#FFFFFF', // 16.0:1 contrast against #12131A
  secondaryText: '#D4D4D5', // Sem UI light grey text (9.2:1 contrast)
  tertiaryText: '#8E92A0', // Sem UI muted grey (4.8:1 contrast - WCAG AA)
  border: 'rgba(255, 255, 255, 0.12)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  inputBackground: '#161720',
  badgeBackground: '#DB2828',
  accent: '#E1306C',
  accentGradient: ['#E1306C', '#991BEA', '#2185D0'],
  storyGradient: ['#E1306C', '#F2711C', '#FBBD08'],
  heartRed: '#FF2A55',
  tabActive: '#FFFFFF',
  tabInactive: '#8E92A0',
  divider: 'rgba(255, 255, 255, 0.08)',
  positive: '#2ECC71',
  negative: '#FF4D4D',
  warning: '#F39C12',
  info: '#00B5AD',
};

export const shadowGradients = {
  mainFeed: ['#4E137D', '#791DA6', '#C724B1', '#FF3B8A'],
  softPastel: ['#7A58E6', '#B77DE8', '#F5A7C4', '#FCD5B5'],
  deepMoody: ['#232A3B', '#161B26', '#0F131D'],
  tealCyan: ['#0A3A40', '#0E626B', '#13928E', '#20C997'],
  warmBronze: ['#3A2C27', '#5C3E33', '#855E4E'],
  categoryTV: ['#7928CA', '#A855F7'],
  categoryShop: ['#EC4899', '#F43F5E'],
  categoryTravel: ['#06B6D4', '#3B82F6'],
  categoryFitness: ['#F97316', '#FB7185'],
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
