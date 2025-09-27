"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Users, Calendar, Search, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { ImageCarousel } from "./ImageCarousel"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [])

  // Dados para o carrossel de imagens
  const carouselImages = [
    "/Carousel-1.png",
    "/Carousel-1.png",
    "/Carousel-1.png",
  ];

  // Dados para os cards de funcionalidades, agora com imagens
  const featureCards = [
    {
      imageUrl: "https://placehold.co/400x300/FC9056/333333"
    },
    {
      imageUrl: "https://placehold.co/400x300/D2FD6D/333333"
    },
    {
      imageUrl: "https://placehold.co/400x300/FC9056/333333"
    }
  ];

  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      <div className="relative max-w-screen mx-auto px-0 sm:px-6">
        <div
          className={`mt-24 relative transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="relative md:mx-auto max-w-7xl">
            <div className="sm:p-0 md:p-6 space-y-8">
              {/* Componente do Carrossel de Imagens */}
              <ImageCarousel images={carouselImages} />
              
              {/* Grid de Cards com Imagens */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
                {featureCards.map((card, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                    {/* Imagem do Card */}
                    <div className="w-full aspect-video">
                      <img 
                        src={card.imageUrl} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = 'https://placehold.co/400x300/1a1a1a/ffffff?text=Erro+ao+carregar';
                        }}
                      />
                    </div>
                    {/* Conteúdo do Card */}
                  
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}