import Image from 'next/image';

// Datos estáticos por ahora (después conectaremos con Firebase)
const coachesData = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    specialty: 'CrossFit L1, Halterofilia',
    bio: 'Apasionado por el fitness con más de 8 años de experiencia. Le encanta motivar y ver el progreso de cada atleta.',
    image: 'https://placehold.co/400x400/dc2626/white?text=Carlos',
  },
  {
    id: '2',
    name: 'Ana Rodríguez',
    specialty: 'CrossFit L2, Nutrición',
    bio: 'Especialista en ayudar a principiantes. Combina entrenamiento con consejos nutricionales.',
    image: 'https://placehold.co/400x400/1a1a1a/white?text=Ana',
  },
  {
    id: '3',
    name: 'Luis Gómez',
    specialty: 'Halterofilia, Movilidad',
    bio: 'Ex competidor nacional de halterofilia. Perfeccionista de la técnica y gran mentor.',
    image: 'https://placehold.co/400x400/333333/white?text=Luis',
  },
  {
    id: '4',
    name: 'María Sánchez',
    specialty: 'Yoga, Funcional',
    bio: 'Instructora certificada de yoga. Aporta equilibrio y consciencia corporal al equipo.',
    image: 'https://placehold.co/400x400/555555/white?text=Maria',
  },
];

export default function CoachesPage() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Nuestros+Coaches"
            alt="Coaches de AVC Fitness Center"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Conoce a nuestros <span className="text-avc-red">Coaches</span>
          </h1>
          <p className="text-xl text-gray-200">
            Profesionales apasionados dedicados a tu éxito y bienestar.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nuestro <span className="text-avc-red">Equipo</span>
            </h2>
            <p className="text-lg text-gray-300">
              Cada coach de AVC está certificado, capacitado y, lo más importante, comprometido
              con ayudarte a alcanzar tus objetivos de forma segura y efectiva.
            </p>
          </div>

          {/* Grid de Coaches */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coachesData.map((coach) => (
              <div
                key={coach.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-avc-red"
              >
                <div className="relative h-64">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{coach.name}</h3>
                  <p className="text-avc-red font-semibold mb-3">{coach.specialty}</p>
                  <p className="text-gray-400 text-sm">{coach.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
