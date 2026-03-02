
import { Employee } from '../types';

export const COLORS = [
  'bg-amber-100 text-amber-800',
  'bg-orange-100 text-orange-800',
  'bg-yellow-100 text-yellow-800',
  'bg-emerald-100 text-emerald-800',
  'bg-sky-100 text-sky-800',
  'bg-rose-100 text-rose-800',
  'bg-indigo-100 text-indigo-800',
  'bg-violet-100 text-violet-800',
];

export const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const getNextFridays = (count: number = 10): Date[] => {
  const fridays: Date[] = [];
  let current = new Date();

  // Find next Friday
  while (current.getDay() !== 5) {
    current.setDate(current.getDate() + 1);
  }

  for (let i = 0; i < count; i++) {
    fridays.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return fridays;
};

/**
 * Returns the most recent Friday that has fully passed.
 * If today IS Friday it is not considered "past" yet — the previous Friday is returned.
 */
export const getMostRecentPastFriday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=Sun … 5=Fri, 6=Sat
  // Fri(5)→7, Sat(6)→1, Sun(0)→2, Mon(1)→3, …, Thu(4)→6
  const daysBack = day === 5 ? 7 : day === 6 ? 1 : day + 2;
  const result = new Date(today);
  result.setDate(today.getDate() - daysBack);
  return result;
};

/**
 * Counts how many Fridays have passed since fromDate
 * (up to and including the most recent past Friday).
 */
export const countFridaysSince = (fromDate: Date): number => {
  const pastFriday = getMostRecentPastFriday();
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  if (pastFriday <= from) return 0;
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round((pastFriday.getTime() - from.getTime()) / msPerWeek);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
