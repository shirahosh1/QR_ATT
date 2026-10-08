export const COLORS = {
  // ==============================================
  // BRAND BLUE FAMILY — Logo, Buttons, Primary Identity
  // ==============================================
  primary: '#2563EB',        // Vibrant medium blue — main logo, primary buttons, active states
  primaryDark: '#1D4ED8',    // Deep blue — hover, pressed, strong headers
  primaryLight: '#DBEAFE',   // Soft pale blue — badges, highlights, light accents
  primaryBright: '#3B82F6',  // Lively blue — gradients, glowing accents, highlights

  secondary: '#0EA5E9',      // Sky blue — secondary buttons, links, accents
  secondaryLight: '#E0F2FE', // Pale sky blue — soft sections, info backgrounds

  // ==============================================
  // PAGE & LAYER BACKGROUNDS
  // ==============================================
  background: '#EFF6FF',     // Very pale blue — main screen background (clean & bright)
  backgroundAlt: '#DBEAFE',  // Light blue tint — alternate sections, grouped areas
  backgroundSoft: '#F0F7FF', // Ultra-soft blue — inputs, subtle shaded rows
  surface: '#FFFFFF',         // Pure white — cards, content containers
  card: '#FFFFFF',            // Alias of surface — used by cards and inputs across the app
  surfaceTint: '#F0F4FF',     // Faint blue-white — card headers, list items

  // ==============================================
  // NAVIGATION — Top Header & Bottom Tabs
  // ==============================================
  navPrimary: '#1E40AF',      // Deep royal blue — top header bar / main navigation
  navSecondary: '#FFFFFF',    // Clean white — bottom tab bar
  navAccent: '#2563EB',       // Brand blue — active tab indicator, underline
  navBorder: '#BFDBFE',       // Soft blue divider — nav separators
  navBorderDark: '#3B82F6',   // Lighter blue for dark nav dividers

  navTextActive: '#2563EB',   // Active link / selected tab
  navTextInactive: '#64748B', // Muted slate — unselected items (darker for readability)
  navTextOnDark: '#FFFFFF',   // White text — for dark blue header
  navTextOnLight: '#1E293B',  // Dark slate — for light/white navigation

  // ==============================================
  // TEXT HIERARCHY
  // ==============================================
  textPrimary: '#0F172A',     // Deep slate — headings, body text
  textSecondary: '#475569',   // Cool gray — labels, descriptions
  textMuted: '#94A3B8',       // Pale slate — hints, timestamps
  textOnPrimary: '#FFFFFF',   // White — text on primary blue buttons/badges
  textOnSecondary: '#FFFFFF',// White — text on sky blue accents
  textOnLight: '#1E40AF',     // Deep blue — text on pale blue backgrounds

  // ==============================================
  // BUTTONS & INTERACTIVE ELEMENTS
  // ==============================================
  btnPrimary: '#2563EB',      // Main action button
  btnPrimaryHover: '#1D4ED8', // Hover state
  btnPrimaryActive: '#1E40AF',// Pressed state
  btnSecondary: '#0EA5E9',    // Secondary / outline button
  btnSecondaryHover: '#0284C7',
  btnLight: '#EFF6FF',        // Soft filled button
  btnLightText: '#1E40AF',    // Text on light button
  btnDisabled: '#CBD5E1',     // Inactive button
  btnDisabledText: '#94A3B8',

  // ==============================================
  // BORDERS & DIVIDERS
  // ==============================================
  border: '#BFDBFE',          // Standard borders — inputs, cards
  borderLight: '#E0E7FF',     // Subtle dividers
  borderDark: '#93C5FD',      // Emphasized borders

  // ==============================================
  // STATUS & ALERTS — Harmonized with Blue Theme
  // ==============================================
  success: '#0284C7',         // Deep sky blue — success messages
  successBg: '#E0F2FE',       // Pale sky blue — success background
  warning: '#F59E0B',         // Warm amber — clear but harmonious
  warningBg: '#FFFBEB',
  danger: '#DC2626',          // Clear red — errors, destructive
  dangerBg: '#FEF2F2',
  info: '#2563EB',            // Match primary — info tips
  infoBg: '#DBEAFE',          // Pale blue — info background

  // ==============================================
  // SHADOWS & OVERLAYS
  // ==============================================
  shadow: 'rgba(37, 99, 235, 0.12)',   // Blue-tinted shadow — soft & cohesive
  shadowDark: 'rgba(30, 64, 175, 0.18)',
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;