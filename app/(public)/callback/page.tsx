import { Suspense } from 'react';
import CallbackClient from '@/features/callback/CallbackClient';
import { Loader2 } from 'lucide-react';

// Um componente simples para mostrar enquanto o Suspense aguarda
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#FC9056]" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackClient />
    </Suspense>
  );
}