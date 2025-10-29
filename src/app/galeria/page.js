'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function GaleriaPage() {
  const galleryRef = useScrollAnimation({ stagger: 0.1 });

  const galleryItems = [
    { src: 'https://placehold.co/600x400/dc2626/white?text=Box+1', alt: 'Instalaciones 1' },
    { src: 'https://placehold.co/600x400/1a1a1a/white?text=Box+2', alt: 'Instalaciones 2' },
    { src: 'https://placehold.co/600x400/333333/white?text=Entrenamiento+1', alt: 'Entrenamiento 1' },
    { src: 'https://placehold.co/600x400/555555/white?text=Entrenamiento+2', alt: 'Entrenamiento 2' },
    { src: 'https://placehold.co/600x400/666666/white?text=Comunidad+1', alt: 'Comunidad 1' },
    { src: 'https://placehold.co/600x400/777777/white?text=Comunidad+2', alt: 'Comunidad 2' },
    { src: 'https://placehold.co/600x400/888888/white?text=Eventos+1', alt: 'Eventos 1' },
    { src: 'https://placehold.co/600x400/999999/white?text=Eventos+2', alt: 'Eventos 2' },
    { src: 'https://placehold.co/600x400/aaaaaa/white?text=Coaches+1', alt: 'Coaches 1' },
  ];

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/dc2626/333333?text=Galeria+AVC"
            alt="Galería"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Tour por <span className="text-avc-red">AVC</span>
          </h1>
          <p className="text-xl text-gray-200">
            Conoce nuestras instalaciones y vive la experiencia AVC
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div ref={galleryRef} className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} data-animate className="gallery-item group cursor-pointer">
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
                <div className="gallery-item-overlay">
                  <span className="text-lg font-semibold">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
