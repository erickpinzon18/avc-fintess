'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ClasesPage() {
  const classesRef = useScrollAnimation({ stagger: 0.15 });

  const classes = [
    {
      name: 'CrossFit',
      description: 'Entrenamiento funcional de alta intensidad que combina fuerza, técnica y cardio. Trabajamos con barra olímpica, movimientos gimnásticos, mancuernas, cuerdas, remadora y bicicleta.',
      target: 'Todos los niveles, sin experiencia previa necesaria.',
      benefits: 'Desarrollo equilibrado de todo el cuerpo, fuerza, resistencia y técnica.',
      price: 'Clase individual: $80 | Mensual: $850 | Pareja: $800 c/u | Equipo (3-6): $750 c/u',
      image: 'https://placehold.co/600x400/dc2626/white?text=CrossFit',
      freeTrial: true,
    },
    {
      name: 'Funcional',
      description: 'Entrenamiento completo diseñado para aumentar masa muscular, mejorar composición corporal e incrementar resistencia cardiovascular.',
      target: 'Todos los niveles, adaptado completamente a tu nivel.',
      benefits: 'Mejor rendimiento físico, salud integral y resistencia.',
      price: 'Clase individual: $60 | Semanal: $250 | Mensual: $800',
      image: 'https://placehold.co/600x400/1a1a1a/white?text=Funcional',
      freeTrial: true,
    },
    {
      name: 'Halterofilia',
      description: 'Entrenamiento especializado en desarrollar fuerza y potencia con barra olímpica. Aprende Arranque (Snatch) y Envión (Clean & Jerk).',
      target: 'Desde principiantes hasta avanzados con enfoque en técnica.',
      benefits: 'Fuerza explosiva, coordinación, potencia y control corporal.',
      price: 'Clase individual: $200 | Mensual: $850',
      image: 'https://placehold.co/600x400/333333/white?text=Halterofilia',
      freeTrial: false,
    },
    {
      name: 'Indoor Cycling',
      description: 'Clase tipo spinning con música, luces y mucha energía. Mejora tu resistencia cardiovascular mientras quemas calorías.',
      target: 'Todos los niveles, tú marcas tu ritmo.',
      benefits: 'Resistencia cardiovascular, quema de calorías, libera estrés.',
      price: 'Individual: $85 | 12 clases: $900 | 15 clases: $1,050 | 20 clases: $1,400',
      promo: 'Paga 10 clases y recibe 12 por $750',
      image: 'https://placehold.co/600x400/555555/white?text=Indoor+Cycling',
      freeTrial: false,
      trialPrice: '$50',
    },
    {
      name: 'Zumba',
      description: '¡Ejercicio, ritmo y diversión! Baila al ritmo de distintos géneros musicales mientras quemas calorías y liberas estrés.',
      target: 'Todas las edades, sin experiencia necesaria.',
      benefits: 'Quema de calorías, mejora cardiovascular, diversión.',
      price: '1 clase: $45 | 3 clases: $120 | 6 clases: $240 | 9 clases: $320 | 12 clases: $420',
      promo: '¡2x1 en clases este mes!',
      image: 'https://placehold.co/600x400/ff1493/white?text=Zumba',
      freeTrial: false,
    },
    {
      name: 'Funcional Kids',
      description: 'Versión adaptada del entrenamiento funcional para niños de 6 a 11 años. A través de juegos y ejercicios seguros desarrollan coordinación y fuerza.',
      target: 'Niños de 6 a 11 años.',
      benefits: 'Coordinación, fuerza, confianza y diversión.',
      price: 'Clase individual: $85 | Mensual: $500',
      image: 'https://placehold.co/600x400/ffa500/white?text=Funcional+Kids',
      freeTrial: false,
    },
    {
      name: 'Salsa y Cumbia',
      description: 'Aprende pasos básicos, movimientos con estilo y coreografías sencillas mientras disfrutas de la música. No necesitas pareja.',
      target: 'Todas las edades, sin experiencia previa.',
      benefits: 'Mejora tu ritmo, coordinación y confianza.',
      price: '1 clase (2 hrs): $60 | 4 clases: $200',
      image: 'https://placehold.co/600x400/ff6347/white?text=Salsa+y+Cumbia',
      freeTrial: false,
    },
    {
      name: 'Flexibilidad',
      description: 'Clase enfocada en estiramientos controlados, técnicas de movilidad y respiración. Previene lesiones y mejora amplitud de movimiento.',
      target: 'Todos los niveles, complementa cualquier disciplina.',
      benefits: 'Mejor movilidad, prevención de lesiones, menos tensiones.',
      price: 'Socios AVC: $60 | Externos: $100',
      image: 'https://placehold.co/600x400/9370db/white?text=Flexibilidad',
      freeTrial: false,
    },
    {
      name: 'Eventos Especiales',
      description: 'Clases temáticas, retos y convivencias diseñadas para toda la comunidad AVC. Una oportunidad única de integración y diversión.',
      target: 'Toda la comunidad AVC.',
      benefits: 'Diversión, integración, motivación y retos únicos.',
      price: 'Varía según el evento - Consulta en recepción',
      image: 'https://placehold.co/600x400/999999/white?text=Eventos',
      freeTrial: false,
    },
  ];

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Nuestras+Clases+AVC"
            alt="Clases en AVC Fitness Center"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Encuentra tu <span className="text-avc-red">pasión</span>
          </h1>
          <p className="text-xl text-gray-200">
            Tenemos una variedad de clases y actividades diseñadas para cada nivel y objetivo.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Explora nuestras <span className="text-avc-red">Actividades</span>
            </h2>
            <p className="text-lg text-gray-300">
              Desde alta intensidad hasta movilidad y diversión, tenemos algo para ti. Cada
              clase está diseñada para motivarte y ayudarte a alcanzar tus metas en un
              ambiente increíble.
            </p>
          </div>

          {/* Grid de Clases */}
          <div
            ref={classesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {classes.map((clase, index) => (
              <div
                key={index}
                data-animate
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-avc-red"
              >
                <div className="relative h-48">
                  <Image
                    src={clase.image}
                    alt={clase.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{clase.name}</h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{clase.description}</p>
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-avc-red font-semibold text-sm">Dirigido a:</span>
                      <p className="text-gray-400 text-sm">{clase.target}</p>
                    </div>
                    <div>
                      <span className="text-avc-red font-semibold text-sm">Beneficios:</span>
                      <p className="text-gray-400 text-sm">{clase.benefits}</p>
                    </div>
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <span className="text-avc-red font-semibold text-sm">Precios:</span>
                      <p className="text-gray-300 text-sm mt-1">{clase.price}</p>
                      {clase.promo && (
                        <p className="text-green-400 text-sm font-semibold mt-2">🎉 {clase.promo}</p>
                      )}
                      {clase.freeTrial && (
                        <p className="text-green-400 text-sm font-semibold mt-2">✨ Clase muestra GRATIS</p>
                      )}
                      {clase.trialPrice && (
                        <p className="text-yellow-400 text-sm font-semibold mt-2">Clase muestra: {clase.trialPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/horarios"
              className="bg-avc-red hover:bg-avc-red-dark text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg inline-block"
            >
              Ver horarios y reservar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
