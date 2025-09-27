import SubscriptionForm from "@/components/SubscriptionForm"
import Link from "next/link"
import AuthHeader from "@/components/shared/AuthHeader"

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="py-12 pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold text-[#FC9056]">Checkout Teste</h1>
            </Link>
            <h2 className="text-3xl font-extrabold text-foreground">Assinar Plano Premium</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Desbloqueie todos os recursos e torne suas avaliações públicas
            </p>
          </div>

          <div className="bg-card shadow-xl rounded-lg overflow-hidden border border-border">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground">Plano Premium</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-[#FC9056]">R$ 9,90</span>
                  <span className="text-lg text-muted-foreground">/mês</span>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-foreground mb-4">Benefícios inclusos:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">Avaliações públicas visíveis para clientes</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">Destaque nos resultados de busca</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">Relatórios detalhados de performance</span>
                  </li>
                </ul>
              </div>

              <SubscriptionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
