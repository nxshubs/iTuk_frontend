export interface Service {
    id: string;
    name: string;
    description?: string | null;
    durationInMinutes: number;
    price: number;
}