"use client"

import { useState } from "react"; // Importe o useState
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Check, Sparkles, Loader2 } from "lucide-react"; // Adicione o Loader2
import Cookies from 'js-cookie'; // Para pegar o token de autenticação
import { toast } from "sonner"; // Para exibir notificações de erro

// A lista de benefícios continua a mesma
const premiumFeatures = [
  "Torne suas avaliações visíveis para todos",
  "Apareça com destaque nas buscas da plataforma",
  "Receba um selo de perfil verificado e profissional",
  "Aumente suas chances de conseguir novos clientes",
];

export default function PremiumAlert() {
  // Estado para gerenciar o carregamento do botão
  const [isLoading, setIsLoading] = useState(false);

  // Função que chama sua API
  const handleSubscription = async () => {
    setIsLoading(true);
    const token = Cookies.get('authToken');

    if (!token) {
      toast.error("Você não está autenticado. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-subscription-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || "Não foi possível iniciar a assinatura.");
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("URL de checkout não encontrada.");
      }

    } catch (error: any) {
      console.error("Erro ao criar sessão de assinatura:", error);
      toast.error(error.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full py-8 animate-fade-in">
      <Card className="w-full max-w-2xl shadow-xl dark:shadow-black/20 overflow-hidden">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center">
          <div className="p-4 bg-primary/10 dark:bg-orange-950/30 rounded-full mb-6 border border-primary/20">
            <Lock className="w-12 h-12 text-[#FC9056]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Desbloqueie Todo o Seu Potencial
          </h2>
          <p className="mt-2 mb-8 text-muted-foreground max-w-md">
            Sua conta atual tem recursos limitados. Faça o upgrade para o Premium e ganhe a visibilidade que seu trabalho merece.
          </p>

          <div className="text-left space-y-3 mb-10 w-full max-w-sm">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* 👇 BOTÃO ATUALIZADO 👇 */}
          <Button 
            onClick={handleSubscription}
            disabled={isLoading}
            size="lg" 
            className="bg-gradient-to-r from-[#FC9056] to-[#ff8340] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Assinar Premium Agora
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}