/**
 * Central theme export.
 */
import colors from './colors';
import spacing, {radii, layout} from './spacing';
import typography from './typography';

export {colors, spacing, radii, layout, typography};

/**
 * Shared card style — applied to most surface containers.
 */
export const cardStyle = {
  backgroundColor: colors.surface,
  borderRadius: radii.lg,
  borderWidth: 1,
  borderColor: colors.cardBorder,
  padding: layout.cardPadding,
};

export const shadowStyle = {
  shadowColor: colors.shadow,
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 4,
};
