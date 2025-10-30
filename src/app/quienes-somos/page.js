'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function QuienesSomosPage() {
  const activities = [
    'CrossFit',
    'Entrenamiento Funcional',
    'Halterofilia',
    'Indoor Cycling',
    'Zumba',
    'Baile',
    'Flexibilidad'
  ];

  const values = [
    {
      title: 'Salud y bienestar',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
    },
    {
      title: 'Respeto e inclusión',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3v2m10 0v-2a3 3 0 00-5.356-1.857M17 20H7"></path>
        </svg>
      ),
    },
    {
      title: 'Motivación',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
    },
    {
      title: 'Compromiso',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      title: 'Ambiente familiar',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      title: 'Diversión',
      icon: (
        <svg className="w-10 h-10 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/1a1a1a/333333?text=Comunidad+AVC+Fitness"
            alt="Comunidad de AVC Fitness"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Más que un gimnasio, <br />
            somos <span className="text-avc-red">una familia</span>.
          </h1>
          <p className="text-xl text-gray-200">
            Descubre nuestra filosofía y por qué AVC es tu segundo hogar.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          {/* Introducción y Foto Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="text-lg text-gray-300 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nuestra <span className="text-avc-red">Filosofía</span>
              </h2>
              <p>
                En <span className="font-bold text-white">AVC Fitness</span> creemos
                que entrenar va más allá del ejercicio: es un estilo de vida, una forma de
                sentirte bien contigo mismo y disfrutar el proceso.
              </p>
              <p>
                Somos mucho más que un gimnasio: somos una{' '}
                <span className="text-avc-red font-semibold">comunidad</span> donde cada
                persona encuentra motivación, apoyo y un ambiente lleno de energía positiva.
              </p>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400/333333/white?text=Foto+Comunidad"
                alt="Comunidad AVC"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover hover:scale-105 transition-transform duration-300 w-full"
              />
            </div>
          </div>

          {/* Actividades Destacadas */}
          <div className="my-20 text-center">
            <h3 className="text-3xl font-semibold text-white mb-10">
              Un lugar para <span className="text-avc-red">todo</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {activities.map((activity, index) => (
                <span 
                  key={index}
                  className="bg-gray-800 text-avc-red font-semibold py-3 px-6 rounded-lg shadow-md text-lg transform transition duration-300 hover:scale-110 hover:bg-avc-red hover:text-white cursor-default"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-20">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 transition-all duration-300 hover:border-avc-red hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-white mb-4">
                <span className="text-avc-red">Nuestra</span> Misión
              </h3>
              <p className="text-gray-300 text-lg">
                Ofrecer entrenamientos y actividades deportivas para personas de todas las edades, 
                fomentando un estilo de vida saludable, divertido y lleno de motivación. Cada persona 
                que entre a nuestras instalaciones se siente bienvenida, apoyada y libre de juicios.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 transition-all duration-300 hover:border-avc-red hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-white mb-4">
                <span className="text-avc-red">Nuestra</span> Visión
              </h3>
              <p className="text-gray-300 text-lg">
                Ser reconocidos por nuestro ambiente positivo, familiar y motivador, con presencia 
                en todo el estado. Inspirar a más personas a cuidar su salud y bienestar.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="my-20">
            <h3 className="text-3xl font-semibold text-white text-center mb-10">
              Nuestros <span className="text-avc-red">Valores</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-gray-900 rounded-lg p-6 text-center border-b-4 border-avc-red transition-all duration-300 shadow-lg hover:bg-gray-800 hover:scale-105"
                >
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <span className="font-bold text-lg text-white block">
                    {value.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cultura y Responsabilidad + Fotos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-20">
            <div className="space-y-6">
              <Image
                src="https://placehold.co/600x350/444444/white?text=Foto+Cultura+1"
                alt="Cultura AVC"
                width={600}
                height={350}
                className="rounded-xl shadow-2xl object-cover hover:scale-105 transition-transform duration-300 w-full"
              />
              <Image
                src="https://placehold.co/600x350/555555/white?text=Foto+Cultura+2"
                alt="Responsabilidad AVC"
                width={600}
                height={350}
                className="rounded-xl shadow-2xl object-cover hover:scale-105 transition-transform duration-300 w-full"
              />
            </div>
            <div className="text-lg text-gray-300 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nuestra <span className="text-avc-red">Cultura</span>
              </h2>
              <p>
                Promovemos activamente el <span className="text-white font-semibold">reciclaje</span>, 
                el <span className="text-white font-semibold">consumo local</span> y el{' '}
                <span className="text-white font-semibold">cuidado del medio ambiente</span>.
              </p>
              <p>
                Buscamos crear un espacio integral para crecer, convivir y disfrutar junto a personas 
                que comparten tu misma pasión por mejorar día a día, en todos los aspectos de la vida.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/unete"
              className="bg-avc-red hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg inline-block"
            >
              Únete a nuestra familia
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
