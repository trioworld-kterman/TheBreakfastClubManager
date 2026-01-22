
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

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
