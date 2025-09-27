"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api'; // 1. Usando a nossa função apiFetch

// --- Componentes de Feedback (sem alterações) ---
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

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <p className="text-lg text-red-500">{message}</p>
            <p className="mt-2 text-muted-foreground">Você será redirecionado para a página de login.</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            const apiError = searchParams.get('error');

            if (apiError) {
                setError("Falha na autenticação com o provedor.");
                setTimeout(() => router.push('/login'), 3000);
                return;
            }

            if (token) {
                // Salva o token imediatamente
                Cookies.set('authToken', token, { expires: 7, path: '/' });

                try {
                    // 2. Usando apiFetch. Ele já inclui o token no header.
                    // A verificação de erro 401 (token expirado) é feita DENTRO do apiFetch.
                    const data = await apiFetch('/api/users/me');
                    
                    // Lógica para encontrar o objeto do usuário (sem alterações)
                    let userObject = (data && data.user && typeof data.user.isProfileComplete !== 'undefined')
                        ? data.user
                        : (data && typeof data.isProfileComplete !== 'undefined')
                        ? data
                        : null;
                    
                    if (!userObject) {
                        throw new Error("A resposta da API não contém os dados do usuário esperados.");
                    }
                    
                    // Redireciona com base no status do perfil
                    if (userObject.isProfileComplete) {
                        const dashboardUrl = userObject.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/client';
                        router.push(dashboardUrl);
                    } else {
                        router.push('/complete-profile');
                    }

                } catch (err: any) {
                    // O apiFetch já trata o erro 401. Este catch pegará outros erros.
                    Cookies.remove('authToken');
                    setError(err.message);
                    setTimeout(() => router.push('/login'), 3000);
                }
            } else {
                // 3. Lógica simplificada: se não há token, é um erro.
                setError("Token de autenticação não encontrado na URL.");
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleAuth();
    // A dependência do searchParams garante que o efeito rode quando os parâmetros da URL estiverem disponíveis
    }, [router, searchParams]);

    // A verificação de erro agora acontece antes do return
    if (error) {
        return <ErrorState message={error} />;
    }

    // O estado de loading inicial é gerenciado pelo Suspense no componente pai
    // mas mantemos um aqui para o processo de fetch.
    return <LoadingState message="A autenticar, por favor aguarde..." />;
}