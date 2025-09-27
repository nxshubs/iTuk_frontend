"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function ImageCarousel({ images }: { images: string[] }) {
  // Inicializa o Embla Carousel com a opção de loop infinito e o plugin de autoplay.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex h-60 md:h-96">
          {images.map((src, index) => (
            <div className="relative flex-[0_0_100%] min-w-0" key={index}>
              <img
                src={src}
                alt={`Carousel image ${index + 1}`}
                className="w-full h-full block object-fill md:object-fill aspect-[30/10]"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = 'https://placehold.co/1200x600/1a1a1a/ffffff?text=Imagem+Não+Encontrada';
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none z-10"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors focus:outline-none z-10"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Pontos de Navegação (mesmo estilo do anterior) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              selectedIndex === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}