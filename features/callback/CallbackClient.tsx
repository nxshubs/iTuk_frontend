"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

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

export default function CallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

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
                Cookies.set('authToken', token, { expires: 7, path: '/' });

                try {
                    const userObject = await apiFetch('/api/users/me');
                    
                    if (!userObject) {
                        throw new Error("A resposta da API não contém os dados do usuário esperados.");
                    }
                    
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
                setError("Token de autenticação não encontrado na URL.");
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleAuth();
    }, [router, searchParams]);

    if (error) {
        return <ErrorState message={error} />;
    }

    return <LoadingState message="A autenticar, por favor aguarde..." />;
}