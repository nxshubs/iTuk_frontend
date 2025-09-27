export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  telephone: string | null;
  whatsapp: string | null;
  photoUrl: string | null; 
  googleId?: string | null;
  role: 'CLIENT' | 'PROVIDER';
}