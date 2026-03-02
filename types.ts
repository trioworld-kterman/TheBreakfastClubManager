
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
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  lastRotatedAt?: any; // Firestore Timestamp — anchor for auto-rotation
}

export interface BreadSuggestion {
  title: string;
  description: string;
}
