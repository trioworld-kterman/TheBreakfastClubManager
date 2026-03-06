import { Timestamp } from 'firebase/firestore';

export interface Employee {
  id: string;
  name: string;
  color: string;
  order: number;
  isAttendingBreakfast?: boolean;
}

export interface GroupData {
  key: string;
  name: string;
  employees: Employee[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastRotatedAt?: Timestamp;
}

