'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HomePage() {
  const benefitsRef = useScrollAnimation({ stagger: 0.2 });
  const galleryRef = useScrollAnimation({ stagger: 0.15 });

  const benefits = [
    {
      title: 'Ambiente familiar y positivo',
      description: 'Más que un gimnasio, una familia donde todos se apoyan y crecen juntos. ¡Ven y siéntete parte!',
    },
    {
      title: 'Variedad de actividades',
      description: 'CrossFit, Funcional, Halterofilia... Opciones para cada meta y nivel, nunca te aburrirás.',
    },
    {
      title: 'Coaches capacitados',
      description: 'Expertos apasionados por tu progreso, que te guiarán de forma segura y efectiva en cada WOD.',
    },
    {
      title: 'Comunidad activa',
      description: 'Entrena con amigos y haz nuevos. La motivación nunca falta en nuestra increíble comunidad.',
    },
  ];

  const galleryItems = [
    {
      type: 'image',
      src: 'https://placehold.co/600x400/dc2626/white?text=Foto+WOD',
      alt: 'Entrenamiento CrossFit',
      caption: 'Intensidad en cada WOD',
    },
    {
      type: 'image',
      src: 'https://placehold.co/600x400/1a1a1a/white?text=Comunidad+AVC',
      alt: 'Comunidad AVC',
      caption: 'La fuerza de nuestra comunidad',
    },
    {
      type: 'video',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster: 'https://placehold.co/600x400/000000/ffffff?text=Video+Promo',
      caption: 'Nuestros atletas en acción',
    },
    {
      type: 'image',
      src: 'https://placehold.co/600x400/444444/white?text=Foto+Funcional',
      alt: 'Clase Funcional',
      caption: 'Funcional para todos los niveles',
    },
    {
      type: 'image',
      src: 'https://placehold.co/600x400/555555/white?text=Coaches+Guiando',
      alt: 'Coaches Guiando',
      caption: 'Guía experta de nuestros coaches',
    },
    {
      type: 'video',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster: 'https://placehold.co/600x400/111111/ffffff?text=Video+Ambiente',
      caption: 'Ambiente y energía',
    },
  ];

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-16">
        {/* Imagen de Fondo con superposición oscura */}
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x1080/000000/333333?text=Foto+Gym+Principal"
            alt="Miembros de AVC Fitness entrenando"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        {/* Contenido del Banner */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-8">
            Tu casa fitness te espera. <br /> Supera tus límites, diviértete y{' '}
            <span className="text-avc-red">siente la motivación.</span>
          </h1>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/clases"
              className="bg-avc-red hover:bg-avc-red-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg"
            >
              Conoce nuestras clases
            </Link>
            <Link
              href="/unete"
              className="bg-transparent border-2 border-white hover:border-avc-red hover:text-avc-red text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg"
            >
              Únete ahora
            </Link>
            <Link
              href="/horarios"
              className="bg-transparent border-2 border-white hover:border-avc-red hover:text-avc-red text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg"
            >
              Horario de clases
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFICIOS DESTACADOS */}
      <section className="py-20 bg-gray-900" id="beneficios">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
            ¿Por qué <span className="text-avc-red">AVC Fitness</span>?
          </h2>
          <div
            ref={benefitsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                data-animate
                className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-avc-red"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA DE FOTOS Y VIDEOS */}
      <section className="py-20 bg-gray-950" id="galeria">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
            Momentos en <span className="text-avc-red">AVC</span>
          </h2>

          <div ref={galleryRef} className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div key={index} data-animate className="gallery-item">
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.alt || item.caption}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    controls
                    muted
                    loop
                    playsInline
                    poster={item.poster}
                    className="w-full h-full object-cover"
                  >
                    <source src={item.src} type="video/mp4" />
                    Tu navegador no soporta el tag de video.
                  </video>
                )}
                <div className="gallery-item-overlay">
                  <span className="text-lg font-semibold">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
