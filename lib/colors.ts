// T.UP Brand Colors based on Brand Style Guide

export const colors = {
  // Primary & Accent Colors
  primary: {
    stellar: '#1A2B48',     // Stellar Blue (Primary)
    teal: '#00C49A',        // Ascend Teal (Accent 1)
    gold: '#FFC700',        // Nova Gold (Accent 2)
  },
  
  // Neutral Palette
  neutral: {
    white: '#FFFFFF',
    lightGrey: '#F5F5F7',
    mediumGrey: '#A0AEC0',
    darkGrey: '#4A5568',
    black: '#1A202C',
  },
  
  // Semantic Colors
  success: '#00C49A',       // Using Ascend Teal
  warning: '#FFC700',       // Using Nova Gold
  error: '#EF4444',         // Standard red for errors
  info: '#1A2B48',          // Using Stellar Blue
} as const

// Tailwind CSS custom colors configuration
export const tailwindColors = {
  'stellar': '#1A2B48',
  'teal': '#00C49A',
  'gold': '#FFC700',
  'light-grey': '#F5F5F7',
  'medium-grey': '#A0AEC0',
  'dark-grey': '#4A5568',
  'brand-black': '#1A202C',
}