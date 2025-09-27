"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // 1. Usar os hooks do Next.js
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

// Componente para feedback visual
function LoadingState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#FC9056]" />
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

// Componente para feedback de erro
function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <p className="text-lg text-red-500">{message}</p>
            <p className="mt-2 text-muted-foreground">Você será redirecionado para a página de login.</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    // 2. Obter os objetos router e searchParams com os hooks
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            const apiError = searchParams.get('error');

            if (apiError) {
                setError("Falha na autenticação com o provedor.");
                setTimeout(() => router.push('/login'), 3000); // Usar router.push
                return;
            }

            if (token) {
                Cookies.set('authToken', token, { expires: 7, path: '/' });

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error("Sessão inválida ou token expirado.");
                    }

                    const data = await response.json();

                    // Sua lógica para encontrar o objeto do usuário permanece a mesma
                    let userObject = (data && data.user && typeof data.user.isProfileComplete !== 'undefined')
                        ? data.user
                        : (data && typeof data.isProfileComplete !== 'undefined')
                            ? data
                            : null;

                    if (!userObject) {
                        throw new Error("A resposta da API não contém os dados do usuário esperados.");
                    }

                    // 3. Usar router.push para uma navegação suave (sem recarregar a página)
                    if (userObject.isProfileComplete) {
                        const dashboardUrl = userObject.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/client';
                        router.push(dashboardUrl);
                    } else {
                        router.push('/complete-profile');
                    }

                } catch (err: any) {
                    Cookies.remove('authToken');
                    setError(err.message);
                    setTimeout(() => router.push('/login'), 3000);
                }
            } else {
                // Se nenhum token for encontrado após um breve momento, redireciona
                setTimeout(() => {
                    // Verificação extra para garantir que o token não apareceu enquanto esperávamos
                    if (!searchParams.get('token')) {
                        setError("Token de autenticação não encontrado na URL.");
                        setTimeout(() => router.push('/login'), 3000);
                    }
                }, 500);
            }
        };

        handleAuth();
    }, [router, searchParams]); // O efeito depende do router e dos parâmetros da URL

    if (error) {
        return <ErrorState message={error} />;
    }

    return <LoadingState message="A autenticar, por favor aguarde..." />;
}