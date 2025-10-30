import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

async function getTestimonials() {
  try {
    const testimonialsCol = collection(db, 'testimonials');
    const q = query(testimonialsCol, orderBy('createdAt', 'desc'));
    const testimonialSnapshot = await getDocs(q);
    const testimonialsList = testimonialSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return testimonialsList;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export default async function TestimoniosPage() {
  const testimonials = await getTestimonials();

  const defaultTestimonials = [
    {
      id: '1',
      name: 'Pedro Martínez',
      memberSince: '2022',
      testimonial:
        'AVC cambió mi vida. No solo mejoré mi condición física, también encontré una familia que me motiva cada día.',
      image: 'https://placehold.co/200x200/dc2626/white?text=PM',
      rating: 5,
    },
    {
      id: '2',
      name: 'Laura Fernández',
      memberSince: '2021',
      testimonial:
        'Los coaches son increíbles. Siempre atentos, motivadores y preocupados por tu técnica y progreso.',
      image: 'https://placehold.co/200x200/1a1a1a/white?text=LF',
      rating: 5,
    },
    {
      id: '3',
      name: 'Javier Ruiz',
      memberSince: '2023',
      testimonial:
        'Llegué sin experiencia y con miedo. Ahora el gimnasio es mi lugar favorito. ¡Gracias AVC!',
      image: 'https://placehold.co/200x200/333333/white?text=JR',
      rating: 5,
    },
    {
      id: '4',
      name: 'Carla Jiménez',
      memberSince: '2020',
      testimonial:
        'El ambiente es único. Todos se apoyan, celebran tus logros y te ayudan en los momentos difíciles.',
      image: 'https://placehold.co/200x200/555555/white?text=CJ',
      rating: 5,
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Testimonios+AVC"
            alt="Testimonios AVC"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Lo que dicen nuestros <span className="text-avc-red">miembros</span>
          </h1>
          <p className="text-xl text-gray-200">
            Historias reales de transformación y crecimiento en AVC Fitness.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Testimonios <span className="text-avc-red">Auténticos</span>
            </h2>
            <p className="text-lg text-gray-300">
              Estas son las voces de nuestra comunidad. Personas como tú que decidieron cambiar
              su vida y encontraron en AVC el lugar perfecto para hacerlo.
            </p>
          </div>

          {/* Grid de Testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-avc-red"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={
                        testimonial.image ||
                        testimonial.imageUrl ||
                        'https://placehold.co/200x200/333333/white?text=User'
                      }
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Miembro desde {testimonial.memberSince}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-avc-red"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 italic">&quot;{testimonial.testimonial}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN ANTES Y DESPUÉS */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Transformaciones <span className="text-avc-red">Reales</span>
            </h2>
            <p className="text-lg text-gray-300">
              El compromiso y la constancia traen resultados increíbles. Estamos orgullosos del
              progreso de nuestra comunidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Transformación 1 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
              <div className="grid grid-cols-2">
                {/* ANTES */}
                <div>
                  <div className="relative h-80">
                    <Image
                      src="https://placehold.co/600x600/444444/white?text=ANTES"
                      alt="Foto Antes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-800 text-center">
                    <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold uppercase">
                      Antes
                    </span>
                  </div>
                </div>
                {/* DESPUÉS */}
                <div>
                  <div className="relative h-80">
                    <Image
                      src="https://placehold.co/600x600/777777/white?text=DESPUÉS"
                      alt="Foto Después"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-800 text-center">
                    <span className="inline-block bg-avc-red text-white px-3 py-1 rounded text-sm font-bold uppercase">
                      Después
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-800">
                <h3 className="text-2xl font-bold text-white mb-2">Roberto V. - 6 Meses</h3>
                <p className="text-gray-300">
                  &quot;Cambié mis hábitos y gané confianza. El apoyo de los coaches fue
                  clave.&quot;
                </p>
              </div>
            </div>

            {/* Transformación 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
              <div className="grid grid-cols-2">
                {/* ANTES */}
                <div>
                  <div className="relative h-80">
                    <Image
                      src="https://placehold.co/600x600/444444/white?text=ANTES"
                      alt="Foto Antes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-800 text-center">
                    <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold uppercase">
                      Antes
                    </span>
                  </div>
                </div>
                {/* DESPUÉS */}
                <div>
                  <div className="relative h-80">
                    <Image
                      src="https://placehold.co/600x600/777777/white?text=DESPUÉS"
                      alt="Foto Después"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-800 text-center">
                    <span className="inline-block bg-avc-red text-white px-3 py-1 rounded text-sm font-bold uppercase">
                      Después
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-800">
                <h3 className="text-2xl font-bold text-white mb-2">Laura G. - 1 Año</h3>
                <p className="text-gray-300">
                  &quot;No solo es el peso, es la fuerza que gané, mental y física. Me siento
                  increíble.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN FRASES MOTIVADORAS */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x800/1a1a1a/222222?text=Comunidad+AVC"
            alt="Comunidad AVC"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-8 border-l-4 border-avc-red shadow-xl">
              <p className="text-2xl font-serif italic text-white">
                &quot;Más que un gym, una <span className="text-avc-red font-bold">familia</span>
                .&quot;
              </p>
            </div>
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-8 border-l-4 border-avc-red shadow-xl">
              <p className="text-2xl font-serif italic text-white">
                &quot;Aquí nadie te juzga, todos te{' '}
                <span className="text-avc-red font-bold">apoyan</span>.&quot;
              </p>
            </div>
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-8 border-l-4 border-avc-red shadow-xl">
              <p className="text-2xl font-serif italic text-white">
                &quot;Tu única competencia es contra{' '}
                <span className="text-avc-red font-bold">ti mismo</span>.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
