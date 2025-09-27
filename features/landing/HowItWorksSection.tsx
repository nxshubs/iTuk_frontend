"use client"

import { useEffect, useState } from "react"
import { Search, Calendar, CheckCircle, ArrowRight } from "lucide-react"

export default function HowItWorksSection() {
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

    const element = document.getElementById("how-it-works")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      icon: Search,
      title: "Encontre o Profissional",
      description:
        "Busque por categoria, localização ou avaliações. Nossa IA recomenda os melhores profissionais para você.",
    },
    {
      icon: Calendar,
      title: "Agende o Serviço",
      description: "Escolha data e horário disponíveis. Receba confirmação instantânea e lembretes automáticos.",
    },
    {
      icon: CheckCircle,
      title: "Avalie a Experiência",
      description: "Após o serviço, avalie o profissional e ajude outros usuários a fazer a melhor escolha.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Como{" "}
              <span className="text-[#FC9056]">
                funciona?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-poppins">
              Em apenas 3 passos simples, você conecta com os melhores profissionais
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-13 left-0 right-0 h-0.5 bg-[#FC9056]/50 transform -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`text-center transition-all duration-1000 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 300}ms` }}
                >
                  {/* Step Number */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-[#FC9056] rounded-full mb-8 shadow-2xl">
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-[#D2FD6D] bg-[#D2FD6D] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#000000]">{index + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-4 ">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto font-poppins">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-6 text-[#ff5900]">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
