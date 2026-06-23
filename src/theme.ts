// Design tokens extracted from Figma Make Mobile App Dashboard Design
// Tailwind orange scale + layout values from Dashboard.tsx / DayBox.tsx

export const colors = {
  orange: {
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  white: '#ffffff',
  white70: 'rgba(255, 255, 255, 0.7)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white10: 'rgba(255, 255, 255, 0.1)',
  orange900_40: 'rgba(124, 45, 18, 0.4)',
  orange900_50: 'rgba(124, 45, 18, 0.5)',
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  },
  green: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
  blue: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
  purple: { 400: '#c084fc', 500: '#a855f7', 600: '#9333ea' },
  black40: 'rgba(0, 0, 0, 0.4)',
  black50: 'rgba(0, 0, 0, 0.5)',
} as const;

export const spacing = {
  screenPadding: 24, // p-6
  cardGap: 12, // gap-3 between stat cards
  dayGap: 8, // gap-2 in day grid
  sectionMargin: 24, // mb-6
  headerMargin: 32, // mb-8
  labelMargin: 6, // mb-1.5
} as const;

export const radii = {
  xl: 12, // rounded-xl — day boxes, inputs
  '2xl': 16, // rounded-2xl — stat cards, CTA button
  '3xl': 24, // rounded-3xl — modals
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

export const typography = {
  statValue: { fontSize: 36, fontWeight: '700' as const },
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 14, fontWeight: '500' as const },
  label: { fontSize: 10, fontWeight: '400' as const },
  dayHint: { fontSize: 9, fontWeight: '400' as const },
} as const;
