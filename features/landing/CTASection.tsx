"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function CTASection() {
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

    const element = document.getElementById("cta-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="cta-section" className="py-24 bg-gradient-to-br from-[#FC9056] to-[#ffab7e] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-poppins">
            Cadastre-se gratuitamente e descubra como é fácil conectar com os melhores profissionais ou encontrar novos
            clientes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-[#FC9056] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-2xl group cursor-pointer"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-[#D2FD6D] dark:hover:bg-[#D2FD6D] hover:text-[#000000] px-8 py-4 text-lg font-semibold bg-transparent dark:border-[#ffffff] cursor-pointer"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
