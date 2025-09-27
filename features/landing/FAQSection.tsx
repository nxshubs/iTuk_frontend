"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("faq")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      question: "Como funciona o sistema de pagamento?",
      answer:
        "O pagamento é processado de forma segura através da plataforma. Você só paga após a confirmação do serviço, e oferecemos garantia de reembolso em caso de problemas.",
    },
    {
      question: "Como são verificados os profissionais?",
      answer:
        "Todos os prestadores passam por um processo de verificação que inclui documentos, referências e avaliações. Mantemos um padrão alto de qualidade.",
    },
    {
      question: "Posso cancelar um agendamento?",
      answer:
        "Sim, você pode cancelar até 24 horas antes do horário agendado sem custos. Cancelamentos de última hora podem ter taxas aplicadas.",
    },
    {
      question: "O que acontece se eu não ficar satisfeito?",
      answer:
        "Oferecemos garantia de satisfação. Se não ficar satisfeito, entre em contato conosco e resolveremos a situação, incluindo reembolso quando necessário.",
    },
    {
      question: "Como me torno um prestador na plataforma?",
      answer:
        "É simples! Cadastre-se como prestador, complete seu perfil, envie os documentos necessários e comece a receber solicitações de serviços.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Perguntas{" "}
              <span className="text-[#FC9056]">
                Frequentes
              </span>
            </h2>
            <p className="text-xl text-muted-foreground font-poppins">Tire suas dúvidas sobre nossa plataforma</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#FC9056]/50 transition-colors">
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-foreground text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FC9056] transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-8 pb-6">
                    <p className="text-muted-foreground leading-relaxed font-poppins">{faq.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
