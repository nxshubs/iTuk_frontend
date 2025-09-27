import { Availability } from "./Availability";
import { PortfolioImage } from "./PortfolioImage";
import { Review } from "./Review";
import { Service } from "./Service";

export interface Provider {
    id: string;
    name: string | null;
    email: string;
    photoUrl: string | null; 
    address: string | null;
    service?: string;
    specialty?: string;
    price?: string;
    averageRating: number | null;
    reviewCount: number;
    description?: string | null;
    whatsapp: string | null;
    telephone: string | null;
    instagram: string | null;
    isProfileComplete: boolean;
    nextAvailableDate: string | null;
    paymentMethods: string[];
    services: Service[];
    serviceDescription: string | null;
    portfolio: PortfolioImage[];
    availability: Availability[];
    reviewsReceived: Review[];
    experience?: string;
    completedJobs?: number;
    isFavorite?: boolean; 
}