/**
 * Color palette for SocialConnect — modern social design.
 * Primary accent: indigo → violet gradient (#6366F1 → #8B5CF6).
 */
export const colors = {
  // Brand
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6',
  accent: '#EC4899',

  // Surfaces
  background: '#F8F9FE',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F2F8',
  cardBorder: '#E5E7EB',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // States
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Social
  like: '#EF4444',
  likeActive: '#DC2626',
  comment: '#3B82F6',
  share: '#10B981',

  // Misc
  overlay: 'rgba(15, 23, 42, 0.6)',
  shadow: 'rgba(99, 102, 241, 0.15)',
  divider: '#E2E8F0',
};

/**
 * Linear gradient presets used by react-native-linear-gradient.
 */
export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],
  primaryDark: ['#4F46E5', '#6D28D9'],
  like: ['#EF4444', '#EC4899'],
  accent: ['#8B5CF6', '#EC4899'],
  warm: ['#F59E0B', '#EF4444'],
};

export default colors;
