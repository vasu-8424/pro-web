export type RoleType = "Admin" | "Contractor" | "Engineer" | "Client" | "Accountant";

export interface RoleConfig {
  id: RoleType;
  title: string;
  description: string;
  permissions: string[];
  metricLabel: string;
  metricValue: string;
  actionFocus: string;
}

export interface Activity {
  id: string;
  taskName: string;
  zone: string;
  completion: number; // 0 - 100
  status: "Completed" | "Active" | "On Hold" | "Planning";
  assignee: string;
}

export interface ConstructionMedia {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  locationName: string;
  tag: string;
  mediaUrl: string; // URL or placeholder base64
  user: string;
  description: string;
  safetyRating: "Passed" | "Cautioned";
}

export interface ProjectLogInput {
  date: string;
  weather: string;
  progress: string;
  delays: string;
  workers: string;
  material: string;
  incidents: string;
}

export interface LabourMetric {
  department: string;
  present: number;
  total: number;
  efficiency: number; // 0 - 100
  supervisor: string;
}

export interface FinanceSummary {
  budgetAllocated: number;
  amountExpended: number;
  committedLiabilities: number;
  razorpayLinked: boolean;
  transactions: {
    id: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
    timestamp: string;
    category: string;
  }[];
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
