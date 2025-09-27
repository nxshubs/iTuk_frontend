"use client"

import { Calendar, Star, Users, Shield, Clock, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("features-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema de agendamento automatizado que sincroniza com sua agenda e envia lembretes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Star,
      title: "Avaliações Verificadas",
      description: "Sistema de avaliações transparente com verificação de identidade para máxima confiabilidade.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Rede de Profissionais",
      description: "Acesso a milhares de prestadores qualificados em diversas categorias de serviços.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Transações protegidas com criptografia de ponta e garantia de reembolso.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Disponibilidade 24/7",
      description: "Agende serviços a qualquer hora, com profissionais disponíveis em diversos horários.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Zap,
      title: "Resposta Rápida",
      description: "Confirmação de agendamento em até 15 minutos com notificações em tempo real.",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Por que escolher o{" "}
              <span className="text-[#FC9056]">
                ConnectaServiços?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nossa plataforma oferece uma experiência completa e segura para conectar clientes e prestadores de
              serviços
            </p>
          </div>
        </div>

        <div id="features-section" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl bg-card border border-border hover:border-[#FC9056]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FC9056]/10 hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-[#FC9056] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-[#FC9056]/5 to-[#ffa473]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
