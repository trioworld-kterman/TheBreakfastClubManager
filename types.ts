import { Timestamp } from 'firebase/firestore';

export interface Employee {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface GroupData {
  key: string;
  name: string;
  employees: Employee[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastRotatedAt?: Timestamp;
}

export interface BreadSuggestion {
  title: string;
  description: string;
}
