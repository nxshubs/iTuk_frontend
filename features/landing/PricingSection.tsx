"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X, Star, BarChart2, Image as ImageIcon } from "lucide-react"

export default function PricingSection() {
  return (
    <section className="py-20 bg-muted/30" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Escolha o plano ideal para você</h2>
          <p className="text-xl text-muted-foreground font-poppins">Comece gratuitamente ou desbloqueie recursos premium para impulsionar seu negócio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Gratuito */}
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Plano Gratuito</h3>
              <div className="text-4xl font-bold text-foreground">R$ 0</div>
              <div className="text-muted-foreground ">para sempre</div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-foreground font-poppins">Agendamentos pela plataforma de forma fácil</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-muted-foreground font-poppins">Acesso total às avaliações dos clientes</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-muted-foreground font-poppins">Galeria de fotos para destacar seu perfil</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <span className="text-muted-foreground font-poppins">Painel com controle de atendimentos e lucro</span>
              </li>
            </ul>

            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full border-[#FC9056] text-[#FC9056] hover:bg-[#FC9056] hover:text-white bg-transparent font-bold cursor-pointer"
              >
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Plano Premium */}
          <div className="bg-[#FC9056] rounded-lg shadow-lg p-8 text-white relative flex flex-col">
            <div className="absolute top-0 right-0 bg-[#D2FD6D] text-black px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold ">
              Recomendado
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Plano Premium</h3>
              <div className="text-4xl font-bold">R$ 9,90</div>
              <div className="text-gray-200">por mês</div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <span className="font-poppins">Agendamentos pela plataforma de forma fácil
              </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <span className="font-poppins">Acesso total às avaliações dos clientes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <span className="font-poppins">Galeria de fotos para destacar seu perfil</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <span className="font-poppins">Painel com controle de atendimentos e lucro</span>
              </li>
            </ul>

            <Link href="/subscription">
              <Button className="w-full bg-white hover:bg-[#D2FD6D] hover:text-black cursor-pointer font-bold text-black">Assinar Agora</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
