"use client"

import { useEffect, useState } from "react"
import { Star, Quote } from "lucide-react"

export default function TestimonialsSection() {
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

    const element = document.getElementById("testimonials")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empresária",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Incrível como é fácil encontrar profissionais qualificados. Já agendei mais de 10 serviços e todos foram excelentes!",
    },
    {
      name: "João Santos",
      role: "Eletricista",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Como prestador, a plataforma me trouxe muito mais clientes. O sistema de agendamento é perfeito e as avaliações me ajudam muito.",
    },
    {
      name: "Ana Costa",
      role: "Dona de Casa",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Nunca foi tão simples contratar serviços para casa. A segurança e confiabilidade da plataforma são impressionantes.",
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              O que nossos{" "}
              <span className="text-[#FC9056]">
                usuários dizem
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-poppins">
              Milhares de pessoas já transformaram a forma como contratam e oferecem serviços
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl bg-card border border-border hover:border-[#FC9056]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FC9056]/10 hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="absolute top-6 right-6 text-[#000000] dark:text-[#ffffff]">
                <Quote className="w-8 h-8" />
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm font-poppins">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed italic font-poppins">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
