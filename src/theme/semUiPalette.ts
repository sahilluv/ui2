/**
 * Shadow Application Theme & Design Tokens
 * 
 * Transferred directly from the Instagram UI reference image:
 * - Outer Background: #E1E4E8 (pale cool grey), #9295A6 (muted grey-lavender), #D5D9E0, #E8EBEF
 * - Light-Mode Phone: #F7F8FA (main bg), #FFFFFF (pure white), #F1F3F6 (secondary surface), #E5E7EB (separators), #E1E4E9 (borders)
 * - Dark-Mode Phone: #101010 (main bg), #151517 (near-black), #1C1C20 (secondary), #29292D (elevated card), #303036 (search/nav), #080808 (darkest control)
 * - Main Feed Card: Light #FFFFFF & #F7F8FA (#E9EBEF edge); Dark #29292D & #202023 (#38383D border)
 * - Search Fields: Light #FFFFFF bg, #303036 text, #9A9CA5 placeholder, #A1A4AD icon, #ECEEF2 border
 *                  Dark #303036 bg, #F5F5F7 text, #B4B4BC placeholder, #A9A9B2 icon, #3A3A40 border
 * - Brand Accents: #FF0A78 (primary bright pink), #E1306C (deep magenta), #F72585 (secondary pink),
 *                  #8A2BE2 (vivid purple), #7B2CBF (deep purple), #4F46E5 (blue-violet)
 * - Gradient Accents: Pink #FF0A78, Magenta #E1306C, Purple #8A2BE2, Orange #FF8A00, Yellow-Orange #FFB347
 * - Like Button: Circular #FF0A78 with white heart
 * - Like-Count Pill: Light #E5E5E7 bg with #303036 text; Dark #3A3A40 bg with #F5F5F7 text
 * - Typography: Light Primary #202024, Secondary #777982, Muted #A0A2AA
 *               Dark Primary #F7F7F9, Secondary #C1C1C9, Muted #92929B
 * - Navigation: Light #FFFFFF bg, #FF0A78 active, #A3A5AD inactive
 *               Dark #303036 bg, #FF0A78 active, #C0C0C8 inactive
 */

export const semUiPalette = {
  // Brand accents transferred from reference
  primaryPink: '#FF0A78',
  deepMagenta: '#E1306C',
  secondaryPink: '#F72585',
  vividPurple: '#8A2BE2',
  deepPurple: '#7B2CBF',
  blueViolet: '#4F46E5',
  orange: '#FF8A00',
  yellowOrange: '#FFB347',

  // Core neutral tokens
  black: '#101010',
  nearBlack: '#151517',
  darkElevated: '#29292D',
  darkSearch: '#303036',
  white: '#FFFFFF',
  paleCoolGrey: '#E1E4E8',
  greyLavender: '#9295A6',
  charcoal: '#202024',
  secondaryText: '#777982',
  mutedLabels: '#A0A2AA',

  // Semantic mappings
  red: '#FF0A78',
  yellow: '#FFB347',
  green: '#2ECC71',
  blue: '#4F46E5',
  brandRose: '#FF0A78',
  verifiedBadge: '#FF0A78',
  shadowBlue: '#4F46E5',
} as const;

export const SHADOW_BRAND = {
  // Brand accents
  primary: '#FF0A78',
  magenta: '#E1306C',
  secondaryPink: '#F72585',
  vividPurple: '#8A2BE2',
  deepPurple: '#7B2CBF',
  blueViolet: '#4F46E5',
  orange: '#FF8A00',
  yellowOrange: '#FFB347',

  // Outer Canvas (Section 1)
  canvasBg: '#E1E4E8',
  canvasGeoShape: '#9295A6',
  canvasSecondaryOne: '#D5D9E0',
  canvasSecondaryTwo: '#E8EBEF',

  // Light Mode Surfaces (Section 2, 4, 6, 11, 12, 13)
  lightScreenBg: '#F7F8FA',
  lightWhiteSurface: '#FFFFFF',
  lightSecondarySurface: '#F1F3F6',
  lightSeparator: '#E5E7EB',
  lightBorder: '#E1E4E9',
  lightCardEdge: '#E9EBEF',
  lightSearchBg: '#FFFFFF',
  lightSearchText: '#303036',
  lightSearchPlaceholder: '#9A9CA5',
  lightSearchIcon: '#A1A4AD',
  lightSearchBorder: '#ECEEF2',
  lightTextPrimary: '#202024',
  lightTextSecondary: '#777982',
  lightTextMuted: '#A0A2AA',
  lightLikePillBg: '#E5E5E7',
  lightLikePillText: '#303036',
  lightNavBg: '#FFFFFF',
  lightNavActive: '#FF0A78',
  lightNavInactive: '#A3A5AD',
  lightShadow: 'rgba(146, 149, 166, 0.16)',

  // Dark Mode Surfaces (Section 3, 4, 6, 11, 12, 13)
  darkScreenBg: '#101010',
  darkNearBlackSurface: '#151517',
  darkSecondarySurface: '#1C1C20',
  darkElevatedCard: '#29292D',
  darkSearchNav: '#303036',
  darkestControl: '#080808',
  darkCardBorder: '#38383D',
  darkSeparator: '#303036',
  darkSearchBg: '#303036',
  darkSearchText: '#F5F5F7',
  darkSearchPlaceholder: '#B4B4BC',
  darkSearchIcon: '#A9A9B2',
  darkSearchBorder: '#3A3A40',
  darkTextPrimary: '#F7F7F9',
  darkTextSecondary: '#C1C1C9',
  darkTextMuted: '#92929B',
  darkLikePillBg: '#3A3A40',
  darkLikePillText: '#F5F5F7',
  darkNavBg: '#303036',
  darkNavActive: '#FF0A78',
  darkNavInactive: '#C0C0C8',
  darkShadow: 'rgba(0, 0, 0, 0.5)',

  // Like Button & Like Count (Section 9)
  likeBtnBg: '#FF0A78',
  likeBtnHeart: '#FFFFFF',

  // Gradients (Section 8)
  primaryGradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 25%, #8A2BE2 50%, #FF8A00 75%, #FFB347 100%)',
  pinkPurpleGradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 40%, #8A2BE2 100%)',
  storyRingGradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
  followBtnGradient: 'linear-gradient(90deg, #FF0A78 0%, #E1306C 45%, #8A2BE2 100%)',
} as const;

export interface SemUiThemeTokens {
  background: string;
  surface: string;
  elevatedSurface: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  cardBorder: string;
  divider: string;
  inputBackground: string;
  accent: string;
  accentText: string;
  positive: string;
  negative: string;
  warning: string;
  info: string;
  tabActive: string;
  tabInactive: string;
  tabActiveIndicator: string;
}

export const semUiLightTokens: SemUiThemeTokens = {
  background: '#F7F8FA', // Main light screen background
  surface: '#FFFFFF', // Pure white surface
  elevatedSurface: '#F1F3F6', // Secondary light surface
  surfaceHover: '#E8EBEF',
  textPrimary: '#202024', // Light mode primary text
  textSecondary: '#777982', // Light mode secondary text
  textMuted: '#A0A2AA', // Muted labels
  border: '#E1E4E9', // Light neutral borders
  cardBorder: '#E9EBEF', // Subtle edge
  divider: '#E5E7EB', // Subtle separators
  inputBackground: '#FFFFFF', // Search background
  accent: '#FF0A78', // Primary bright pink
  accentText: '#FFFFFF',
  positive: '#2ECC71',
  negative: '#FF0A78',
  warning: '#FF8A00',
  info: '#4F46E5',
  tabActive: '#FF0A78', // Active accent
  tabInactive: '#A3A5AD', // Inactive icons
  tabActiveIndicator: '#FF0A78',
};

export const semUiDarkTokens: SemUiThemeTokens = {
  background: '#101010', // Main dark screen background
  surface: '#151517', // Near-black surface
  elevatedSurface: '#29292D', // Dark elevated card surface
  surfaceHover: '#1C1C20', // Dark secondary surface
  textPrimary: '#F7F7F9', // Dark mode primary text
  textSecondary: '#C1C1C9', // Dark mode secondary text
  textMuted: '#92929B', // Muted text
  border: '#38383D', // Standard border
  cardBorder: '#38383D', // Subtle border
  divider: '#303036', // Subtle separator
  inputBackground: '#303036', // Dark search field & nav surface
  accent: '#FF0A78', // Primary bright pink
  accentText: '#FFFFFF',
  positive: '#2ECC71',
  negative: '#FF0A78',
  warning: '#FF8A00',
  info: '#4F46E5',
  tabActive: '#FF0A78', // Active accent
  tabInactive: '#C0C0C8', // Inactive icons
  tabActiveIndicator: '#FF0A78',
};

export function getSemUiTokens(isDark: boolean): SemUiThemeTokens {
  return isDark ? semUiDarkTokens : semUiLightTokens;
}
