import { Service } from "./Service";

export interface Appointment {
  id: string;
  client: AssociatedUser;
  provider: AssociatedUser;
  service: Service;

  startTime: string;
  endTime: string;   

  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  

  notes?: string;
  rating?: number;       
  location?: string;
  paymentMethod?: string;
  canReview: boolean;

  rescheduleRequest?: {
    newStartTime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  date: string;     
  time: string;
}

export interface AssociatedUser {
    id: string;
    name: string;
    avatarUrl?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
}


