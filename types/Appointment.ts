export interface Appointment {
  id: string
  providerName: string
  clientName: string
  clientAvatar?: string;
  service: string
  date: string
  time: string
  endTime: string
  status: "upcoming" | "completed" | "cancelled"
  price: string
  phone: string
  email: string
  notes?: string
  rating?: number
  location?: string
  duration?: string
  paymentMethod: string
  rescheduleStatus?: "pending"
  whatsapp: string
  newDate?: string
  newTime?: string
  canReview: boolean
}

