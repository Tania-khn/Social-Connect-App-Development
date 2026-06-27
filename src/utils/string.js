/**
 * Get initials from a display name (used for avatar fallback).
 *
 * @param {string} name
 * @returns {string} 1-2 uppercase letters
 */
export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a deterministic color from a string (for avatar fallback bg).
 * @param {string} str
 * @returns {string} hex color
 */
export function colorFromString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const palette = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
  return palette[Math.abs(hash) % palette.length];
}

/**
 * Truncate text with ellipsis if it exceeds max length.
 */
export function truncate(text = '', max = 100) {
  if (text.length <= max) {
    return text;
  }
  return text.slice(0, max - 1).trimEnd() + '…';
}
