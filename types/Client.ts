export interface Client {
    id: string;
    name: string | null;
    email: string;
    photoUrl: string | null;
    phone: string | null; 
    whatsapp: string | null;
    description: string | null;
    address: string | null;
    googleId?: string | null;
}