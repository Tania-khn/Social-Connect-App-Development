/**
 * Time / date formatting helpers.
 *
 * Uses Intl.RelativeTimeFormat-style logic with a manual fallback
 * so it works on every RN version.
 */

/**
 * Format a Firestore Timestamp or Date into a "time ago" string.
 * Examples: "just now", "5m", "3h", "2d", "Jan 4", "Jan 4, 2024"
 *
 * @param {object|Date|number|null} ts - Firestore Timestamp, Date, or ms epoch
 * @returns {string}
 */
export function timeAgo(ts) {
  if (!ts) {
    return '';
  }
  const date = toDate(ts);
  if (!date) {
    return '';
  }
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const seconds = Math.floor(diff / 1000);

  if (seconds < 30) {
    return 'just now';
  }
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }
  return formatAbsoluteDate(date);
}

/**
 * Format a date as "Jan 4" or "Jan 4, 2024" depending on the year.
 */
export function formatAbsoluteDate(date) {
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  const monthAbbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][date.getMonth()];
  const day = date.getDate();
  if (sameYear) {
    return `${monthAbbr} ${day}`;
  }
  return `${monthAbbr} ${day}, ${date.getFullYear()}`;
}

/**
 * Format a date as "4:35 PM" for message timestamps.
 */
export function formatClockTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

/**
 * Coerce a Firestore Timestamp, Date, number, or string to a Date.
 * Returns null on invalid input.
 */
function toDate(ts) {
  if (!ts) {
    return null;
  }
  if (ts instanceof Date) {
    return ts;
  }
  if (typeof ts === 'number') {
    return new Date(ts);
  }
  if (typeof ts === 'string') {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }
  if (ts.toDate && typeof ts.toDate === 'function') {
    return ts.toDate();
  }
  if (ts.seconds !== undefined) {
    return new Date(ts.seconds * 1000);
  }
  return null;
}
