// Arquivo: types/Review.ts

export interface Review {
  // Estrutura principal
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string; // Usamos createdAt que é mais padrão

  // Objeto para quem fez a avaliação (substitui clientName e clientPhotoUrl)
  reviewer: {
    name: string | null;
    photoUrl: string | null;
  };
  
  // Objeto para quem foi avaliado (substitui providerName)
  reviewed: {
    name: string | null;
  };

  // Informação sobre o serviço avaliado
  service?: {
    name: string | null;
  };

  // Flags de controle
  canEdit?: boolean;
  isPublic?: boolean;
}