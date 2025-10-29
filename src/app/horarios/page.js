'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HorariosPage() {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const pricingRef = useScrollAnimation({ stagger: 0.15 });

  const schedule = {
    Lunes: [
      { time: '6:00 AM', class: 'CrossFit', coach: 'Carlos', type: 'crossfit' },
      { time: '7:00 AM', class: 'Funcional', coach: 'Ana', type: 'funcional' },
      { time: '5:00 PM', class: 'CrossFit', coach: 'Luis', type: 'crossfit' },
      { time: '6:00 PM', class: 'Yoga', coach: 'María', type: 'yoga' },
    ],
    Martes: [
      { time: '6:00 AM', class: 'Halterofilia', coach: 'Luis', type: 'crossfit' },
      { time: '7:00 AM', class: 'CrossFit', coach: 'Carlos', type: 'crossfit' },
      { time: '5:00 PM', class: 'Funcional', coach: 'Ana', type: 'funcional' },
      { time: '6:00 PM', class: 'Acondicionamiento', coach: 'Carlos', type: 'funcional' },
    ],
    Miércoles: [
      { time: '6:00 AM', class: 'CrossFit', coach: 'Ana', type: 'crossfit' },
      { time: '7:00 AM', class: 'Funcional', coach: 'María', type: 'funcional' },
      { time: '5:00 PM', class: 'CrossFit', coach: 'Luis', type: 'crossfit' },
      { time: '6:00 PM', class: 'Yoga', coach: 'María', type: 'yoga' },
    ],
    Jueves: [
      { time: '6:00 AM', class: 'Halterofilia', coach: 'Luis', type: 'crossfit' },
      { time: '7:00 AM', class: 'CrossFit', coach: 'Carlos', type: 'crossfit' },
      { time: '5:00 PM', class: 'Funcional', coach: 'Ana', type: 'funcional' },
      { time: '6:00 PM', class: 'Movilidad', coach: 'María', type: 'yoga' },
    ],
    Viernes: [
      { time: '6:00 AM', class: 'CrossFit', coach: 'Carlos', type: 'crossfit' },
      { time: '7:00 AM', class: 'Funcional', coach: 'Ana', type: 'funcional' },
      { time: '5:00 PM', class: 'CrossFit', coach: 'Luis', type: 'crossfit' },
      { time: '6:00 PM', class: 'Friday Night Lights', coach: 'Todo el equipo', type: 'crossfit' },
    ],
    Sábado: [
      { time: '9:00 AM', class: 'CrossFit', coach: 'Rotativo', type: 'crossfit' },
      { time: '10:00 AM', class: 'Funcional', coach: 'Rotativo', type: 'funcional' },
    ],
  };

  const pricing = [
    {
      name: 'CrossFit',
      price: '$850',
      period: '/mes',
      features: [
        'Clase individual: $80',
        'Mensual individual: $850',
        'Pareja (2 personas): $800 c/u',
        'Equipo (3-6 personas): $750 c/u',
        '✨ Clase muestra GRATIS'
      ],
      popular: true,
      color: 'red',
    },
    {
      name: 'Funcional',
      price: '$800',
      period: '/mes',
      features: [
        'Clase individual: $60',
        'Semanal: $250',
        'Mensual: $800',
        'Incluye acceso a Zona de Programación',
        '✨ Clase muestra GRATIS'
      ],
      popular: false,
      color: 'gray',
    },
    {
      name: 'Halterofilia',
      price: '$850',
      period: '/mes',
      features: [
        'Clase individual: $200',
        'Mensual: $850',
        'Entrenamiento personalizado',
        'Enfoque en técnica olímpica',
        'Sin clase muestra'
      ],
      popular: false,
      color: 'gray',
    },
    {
      name: 'Indoor Cycling',
      price: '$900',
      period: '12 clases',
      features: [
        'Clase individual: $85',
        '12 clases: $900',
        '15 clases: $1,050',
        '20 clases: $1,400',
        '🎉 Promo: 10 clases x $750 (recibes 12)'
      ],
      popular: false,
      color: 'blue',
    },
    {
      name: 'Zumba',
      price: '$420',
      period: '12 clases',
      features: [
        '1 clase: $45',
        '3 clases: $120',
        '6 clases: $240',
        '12 clases: $420',
        '🎉 2x1 este mes'
      ],
      popular: false,
      color: 'pink',
    },
    {
      name: 'Funcional Kids',
      price: '$500',
      period: '/mes',
      features: [
        'Clase individual: $85',
        'Mensual: $500',
        'Edades: 6-11 años',
        '100% lúdico y seguro',
        'Sin clase muestra'
      ],
      popular: false,
      color: 'orange',
    },
  ];

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/444444/555555?text=Horarios+y+Planes+AVC"
            alt="Horarios AVC"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Horarios y <span className="text-avc-red">Membresías</span>
          </h1>
          <p className="text-xl text-gray-200">
            Elige el plan perfecto para ti y descubre nuestros horarios de clases.
          </p>
        </div>
      </section>

      {/* HORARIOS */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nuestros <span className="text-avc-red">Horarios</span>
            </h2>
            <p className="text-lg text-gray-300">
              Selecciona un día para ver las clases disponibles.
            </p>
          </div>

          {/* Selector de Días */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
                  selectedDay === day
                    ? 'bg-avc-red text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Clases del Día Seleccionado */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">{selectedDay}</h3>
            <div className="space-y-4">
              {schedule[selectedDay]?.map((entry, index) => (
                <div
                  key={index}
                  className={`bg-gray-800 border-l-4 rounded-lg p-6 hover:bg-gray-750 transition duration-300 ${
                    entry.type === 'crossfit'
                      ? 'border-avc-red'
                      : entry.type === 'funcional'
                      ? 'border-yellow-500'
                      : 'border-purple-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{entry.time}</p>
                      <p className="text-xl text-gray-300 mt-1">{entry.class}</p>
                      <p className="text-sm text-gray-500">Coach: {entry.coach}</p>
                    </div>
                    <div>
                      <Link
                        href="/unete"
                        className="bg-avc-red hover:bg-avc-red-dark text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ZONA DE PROGRAMACIÓN */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Zona de <span className="text-avc-red">Programación</span>
              </h2>
              <p className="text-lg text-gray-300">
                Un espacio exclusivo diseñado para que trabajes de forma más enfocada en tus objetivos específicos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">💪 ¿Para quién es?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Personas con programaciones externas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Atletas que siguen programas con nuestros coaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Quienes buscan un enfoque competitivo</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Beneficios</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Mejora tu técnica en movimientos específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Entrenamiento enfocado en fuerza</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Sigue tu programación personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Preparación para competencias</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border-2 border-avc-red">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Acceso a la Zona</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-avc-red text-4xl mb-2">✓</div>
                  <h4 className="text-white font-semibold mb-2">Incluido en membresías</h4>
                  <p className="text-gray-300 text-sm">CrossFit y Funcional incluyen acceso a la Zona de Programación</p>
                </div>
                <div className="text-center">
                  <div className="text-avc-red text-4xl mb-2">🏆</div>
                  <h4 className="text-white font-semibold mb-2">Paquete AVC Competición</h4>
                  <p className="text-gray-300 text-sm">Acceso exclusivo a la Zona (sin clases grupales)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBRESÍAS */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Planes de <span className="text-avc-red">Membresía</span>
            </h2>
            <p className="text-lg text-gray-300">
              Elige el plan que mejor se adapte a tus necesidades y objetivos.
            </p>
          </div>

          <div
            ref={pricingRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricing.map((plan, index) => (
              <div
                key={index}
                data-animate
                className={`relative bg-gray-800 rounded-xl p-8 ${
                  plan.popular
                    ? 'border-4 border-avc-red shadow-2xl transform scale-105'
                    : 'border-2 border-gray-700'
                } hover:shadow-2xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-avc-red text-white px-4 py-1 rounded-full text-sm font-bold">
                    MÁS POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-avc-red mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/unete"
                  className={`block text-center font-bold py-3 px-6 rounded-full transition duration-300 ${
                    plan.popular
                      ? 'bg-avc-red hover:bg-avc-red-dark text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Elegir Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
