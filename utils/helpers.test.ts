import { describe, it, expect, vi, afterEach } from 'vitest';
import { getMostRecentPastFriday, countFridaysSince } from './helpers';

describe('getMostRecentPastFriday', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns last Friday when today is Saturday', () => {
    // Saturday 2026-02-28
    vi.setSystemTime(new Date(2026, 1, 28));
    const result = getMostRecentPastFriday();
    expect(result.getDay()).toBe(5); // Friday
    expect(result.getDate()).toBe(27); // 2026-02-27
  });

  it('returns last Friday when today is Monday', () => {
    // Monday 2026-03-02
    vi.setSystemTime(new Date(2026, 2, 2));
    const result = getMostRecentPastFriday();
    expect(result.getDay()).toBe(5);
    expect(result.getDate()).toBe(27); // 2026-02-27
  });

  it('returns the previous Friday (not today) when today is Friday', () => {
    // Friday 2026-02-27
    vi.setSystemTime(new Date(2026, 1, 27));
    const result = getMostRecentPastFriday();
    expect(result.getDay()).toBe(5);
    expect(result.getDate()).toBe(20); // 2026-02-20 (the Friday before)
  });

  it('returns midnight (00:00:00) local time', () => {
    vi.setSystemTime(new Date(2026, 1, 28, 14, 30, 0)); // Saturday afternoon
    const result = getMostRecentPastFriday();
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

describe('countFridaysSince', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 1 when exactly one week has passed', () => {
    // "today" is Saturday 2026-02-28, so getMostRecentPastFriday = 2026-02-27
    vi.setSystemTime(new Date(2026, 1, 28));
    const from = new Date(2026, 1, 20); // previous Friday
    expect(countFridaysSince(from)).toBe(1);
  });

  it('returns 2 when two weeks have passed', () => {
    vi.setSystemTime(new Date(2026, 1, 28)); // Saturday, last Friday = 2026-02-27
    const from = new Date(2026, 1, 13); // two Fridays ago
    expect(countFridaysSince(from)).toBe(2);
  });

  it('returns 0 when from is the most recent past Friday', () => {
    vi.setSystemTime(new Date(2026, 1, 28)); // last Friday = 2026-02-27
    const from = new Date(2026, 1, 27); // same Friday
    expect(countFridaysSince(from)).toBe(0);
  });

  it('returns 0 when from is in the future', () => {
    vi.setSystemTime(new Date(2026, 1, 28)); // last Friday = 2026-02-27
    const from = new Date(2026, 2, 6); // a future Friday
    expect(countFridaysSince(from)).toBe(0);
  });
});
