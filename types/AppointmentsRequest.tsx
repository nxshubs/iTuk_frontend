export interface AppointmentRequest {
  id: string;
  clientName: string;
  clientAvatar: string | null;
  clientPhone: string | null;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  location: string | null; 
  notes?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}