/**
 * Sample smoke tests for SocialConnect utility helpers.
 *
 * Run with: `yarn test`
 */
import {timeAgo} from '../src/utils/time';
import {getInitials, colorFromString, truncate} from '../src/utils/string';

describe('utils/time', () => {
  it('returns empty string for null/undefined', () => {
    expect(timeAgo(null)).toBe('');
    expect(timeAgo(undefined)).toBe('');
  });

  it('returns "just now" for very recent timestamps', () => {
    const now = Date.now();
    expect(timeAgo(now)).toBe('just now');
  });

  it('formats minutes correctly', () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    expect(timeAgo(fiveMinutesAgo)).toBe('5m');
  });

  it('formats hours correctly', () => {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
    expect(timeAgo(threeHoursAgo)).toBe('3h');
  });

  it('formats days correctly', () => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    expect(timeAgo(twoDaysAgo)).toBe('2d');
  });
});

describe('utils/string', () => {
  it('extracts initials from full name', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
  });

  it('extracts single initial from single-word name', () => {
    expect(getInitials('Jane')).toBe('J');
  });

  it('returns ? for empty name', () => {
    expect(getInitials('')).toBe('?');
  });

  it('produces a color from a string', () => {
    expect(colorFromString('Jane Doe')).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('truncates long text', () => {
    const long = 'a'.repeat(150);
    expect(truncate(long, 100)).toHaveLength(100);
    expect(truncate(long, 100)).toMatch(/…$/);
  });

  it('preserves short text', () => {
    expect(truncate('short', 100)).toBe('short');
  });
});
