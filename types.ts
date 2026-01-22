
export interface Employee {
  id: string;
  name: string;
  color: string;
}

export interface GroupData {
  key: string;
  name: string;
  employees: Employee[];
}

export interface BreadSuggestion {
  title: string;
  description: string;
}
