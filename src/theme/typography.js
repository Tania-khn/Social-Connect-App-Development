/**
 * Typography scale for SocialConnect.
 * Uses system fonts to avoid font-loading overhead on first launch.
 */
import {RFValue} from 'react-native-responsive-fontsize';

const baseFont = 'System';

export const typography = {
  // Display
  h1: {
    fontFamily: baseFont,
    fontSize: RFValue(28),
    fontWeight: '800',
    lineHeight: 34,
    color: '#0F172A',
  },
  h2: {
    fontFamily: baseFont,
    fontSize: RFValue(22),
    fontWeight: '700',
    lineHeight: 28,
    color: '#0F172A',
  },
  h3: {
    fontFamily: baseFont,
    fontSize: RFValue(18),
    fontWeight: '700',
    lineHeight: 24,
    color: '#0F172A',
  },
  // Body
  body: {
    fontFamily: baseFont,
    fontSize: RFValue(15),
    fontWeight: '400',
    lineHeight: 22,
    color: '#0F172A',
  },
  bodySmall: {
    fontFamily: baseFont,
    fontSize: RFValue(13),
    fontWeight: '400',
    lineHeight: 18,
    color: '#475569',
  },
  // UI
  button: {
    fontFamily: baseFont,
    fontSize: RFValue(16),
    fontWeight: '700',
    lineHeight: 22,
    color: '#FFFFFF',
  },
  caption: {
    fontFamily: baseFont,
    fontSize: RFValue(12),
    fontWeight: '500',
    lineHeight: 16,
    color: '#94A3B8',
  },
  label: {
    fontFamily: baseFont,
    fontSize: RFValue(14),
    fontWeight: '600',
    lineHeight: 18,
    color: '#0F172A',
  },
};

export default typography;
