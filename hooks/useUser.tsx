// src/hooks/useUser.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface UserData {
  name: string | null;
  photoUrl: string | null;
  role: "PROVIDER" | "CLIENT" | null;
  activeRole: "PROVIDER" | "CLIENT" | null; // Adicionado para saber o perfil ativo
}

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>; 
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Define isLoading como true no início de cada busca
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Sessão inválida. Por favor, faça login novamente.");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err: any) {
      console.error("Falha ao buscar usuário no Provider:", err);
      setError(err.message);
      Cookies.remove('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback não precisa de dependências aqui

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // MUDANÇA: Passamos a função `fetchUser` como `refetchUser` no valor do contexto
  const value = { user, isLoading, error, refetchUser: fetchUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('O hook useUser deve ser utilizado dentro de um UserProvider');
  }
  return context;
}