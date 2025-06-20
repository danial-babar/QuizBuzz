// Font weights
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

// Font sizes
export const fontSizes = {
  // Display
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  
  // Headline
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  
  // Title
  titleLarge: 22,
  titleMedium: 20,
  titleSmall: 18,
  
  // Body
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  
  // Label
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
  
  // Default
  default: 16,
} as const;

// Line heights
export const lineHeights = {
  // Display
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,
  
  // Headline
  headlineLarge: 40,
  headlineMedium: 36,
  headlineSmall: 32,
  
  // Title
  titleLarge: 28,
  titleMedium: 24,
  titleSmall: 20,
  
  // Body
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,
  
  // Label
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 12,
  
  // Default
  default: 24,
} as const;

// Letter spacing
export const letterSpacing = {
  // Display
  displayLarge: 0,
  displayMedium: 0,
  displaySmall: 0,
  
  // Headline
  headlineLarge: 0,
  headlineMedium: 0,
  headlineSmall: 0,
  
  // Title
  titleLarge: 0,
  titleMedium: 0.15,
  titleSmall: 0.1,
  
  // Body
  bodyLarge: 0.5,
  bodyMedium: 0.25,
  bodySmall: 0.4,
  
  // Label
  labelLarge: 0.1,
  labelMedium: 0.5,
  labelSmall: 0.5,
  
  // Default
  default: 0.5,
} as const;

// Font families
export const fontFamilies = {
  // System fonts (default on iOS/Android)
  system: 'System',
  
  // Common font stacks
  sans: {
    regular: 'System',
    light: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // For headings or when you want to use a different font
  serif: {
    regular: 'Georgia',
    light: 'Georgia',
    medium: 'Georgia-Bold',
    semiBold: 'Georgia-Bold',
    bold: 'Georgia-Bold',
  },
  
  // Monospace for code blocks
  monospace: {
    regular: 'Courier',
    light: 'Courier',
    medium: 'Courier',
    semiBold: 'Courier-Bold',
    bold: 'Courier-Bold',
  },
} as const;

// Typography styles
export const typography = {
  // Display
  displayLarge: {
    fontSize: fontSizes.displayLarge,
    lineHeight: lineHeights.displayLarge,
    fontWeight: fontWeights.light,
    letterSpacing: letterSpacing.displayLarge,
  },
  displayMedium: {
    fontSize: fontSizes.displayMedium,
    lineHeight: lineHeights.displayMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.displayMedium,
  },
  displaySmall: {
    fontSize: fontSizes.displaySmall,
    lineHeight: lineHeights.displaySmall,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.displaySmall,
  },
  
  // Headline
  headlineLarge: {
    fontSize: fontSizes.headlineLarge,
    lineHeight: lineHeights.headlineLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.headlineLarge,
  },
  headlineMedium: {
    fontSize: fontSizes.headlineMedium,
    lineHeight: lineHeights.headlineMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.headlineMedium,
  },
  headlineSmall: {
    fontSize: fontSizes.headlineSmall,
    lineHeight: lineHeights.headlineSmall,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.headlineSmall,
  },
  
  // Title
  titleLarge: {
    fontSize: fontSizes.titleLarge,
    lineHeight: lineHeights.titleLarge,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.titleLarge,
  },
  titleMedium: {
    fontSize: fontSizes.titleMedium,
    lineHeight: lineHeights.titleMedium,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.titleMedium,
  },
  titleSmall: {
    fontSize: fontSizes.titleSmall,
    lineHeight: lineHeights.titleSmall,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.titleSmall,
  },
  
  // Body
  bodyLarge: {
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.bodyLarge,
  },
  bodyMedium: {
    fontSize: fontSizes.bodyMedium,
    lineHeight: lineHeights.bodyMedium,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.bodyMedium,
  },
  bodySmall: {
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.bodySmall,
  },
  
  // Label
  labelLarge: {
    fontSize: fontSizes.labelLarge,
    lineHeight: lineHeights.labelLarge,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.labelLarge,
  },
  labelMedium: {
    fontSize: fontSizes.labelMedium,
    lineHeight: lineHeights.labelMedium,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.labelMedium,
  },
  labelSmall: {
    fontSize: fontSizes.labelSmall,
    lineHeight: lineHeights.labelSmall,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.labelSmall,
  },
} as const;

export default {
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  fontFamilies,
  typography,
};
