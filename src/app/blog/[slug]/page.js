'use client';

import Image from 'next/image';
import Link from 'next/link';

// Datos estáticos de posts (después conectaremos con Firebase)
const postsData = [
  {
    id: '1',
    slug: 'mitos-proteina-crossfit',
    title: 'Los 5 Mitos Más Comunes sobre la Proteína y el CrossFit',
    category: 'Nutrición',
    date: '28 de Octubre, 2025',
    author: 'Equipo AVC',
    image: 'https://placehold.co/1200x600/dc2626/FFFFFF?text=Mitos+de+la+Proteína',
    content: `
      <p>
        El mundo del fitness, y especialmente el del CrossFit, está lleno de información. A veces, es difícil separar la realidad de la ficción, sobre todo cuando hablamos de nutrición. La proteína es, sin duda, el macronutriente más debatido. ¿Realmente necesitas ese batido post-entreno? ¿Comer "demasiada" proteína es malo?
      </p>
      <p>
        Vamos a desmentir los 5 mitos más comunes que escuchamos en el box para que puedas tomar decisiones informadas sobre tu alimentación y optimizar tu recuperación.
      </p>
      
      <h2>Mito 1: "Necesitas un batido de proteína INMEDIATAMENTE después de entrenar"</h2>
      <p>
        La famosa "ventana anabólica". Si bien es cierto que tu cuerpo está receptivo a los nutrientes después de un WOD intenso, la urgencia no es tan dramática como se piensa. Los estudios demuestran que la ingesta total de proteína a lo largo del día es mucho más importante que el *timing* exacto. Si comes una comida rica en proteínas 1-2 horas antes de entrenar y otra 1-2 horas después, probablemente estés cubierto. El batido es una herramienta de *conveniencia*, no una regla mágica.
      </p>

      <h2>Mito 2: "Comer mucha proteína daña los riñones"</h2>
      <p>
        Este es un mito persistente. En individuos *sanos* (es decir, sin enfermedad renal preexistente), no hay evidencia científica sólida que demuestre que una dieta alta en proteínas cause daño renal. Los riñones están diseñados para filtrar los subproductos del metabolismo de las proteínas. Si tienes una condición médica, debes consultar a tu médico, pero para el atleta promedio, consumir una cantidad adecuada (ej. 1.6-2.2g por kg de peso) es seguro.
      </p>

      <blockquote>
        "La proteína es una herramienta de conveniencia, no una regla mágica. Tu ingesta total diaria es lo que realmente importa."
      </blockquote>

      <h2>Mito 3: "Solo puedes absorber 30g de proteína por comida"</h2>
      <p>
        Falso. El cuerpo puede *absorber* casi toda la proteína que le des. La pregunta real es cuánta puede *utilizar* para la síntesis de proteínas musculares (construcción de músculo) en un momento dado. Aunque el pico de síntesis puede estar alrededor de 25-35g, el resto de la proteína no se desperdicia; se oxida para obtener energía o se utiliza para otros procesos corporales. Es mejor distribuir tu ingesta en 3-5 comidas al día, pero no te estreses si una comida tiene 50g.
      </p>
      
      <h2>Mito 4: "Las dietas altas en proteína te hacen engordar"</h2>
      <p>
        Ningún macronutriente por sí solo te hace engordar. El aumento de peso se debe a un superávit calórico (comer más calorías de las que quemas). De hecho, la proteína es el macronutriente más saciante, lo que significa que te ayuda a sentirte lleno por más tiempo, pudiendo *ayudar* en la pérdida de grasa.
      </p>
      
      <h2>Mito 5: "Las fuentes de proteína vegetal son inferiores"</h2>
      <ul>
        <li>Las proteínas vegetales (lentejas, garbanzos, tofu, etc.) pueden ser ligeramente menos biodisponibles que las animales.</li>
        <li>A algunas les falta uno o más aminoácidos esenciales (son "incompletas").</li>
        <li>Sin embargo, esto se soluciona fácilmente comiendo una *variedad* de fuentes vegetales a lo largo del día (ej. arroz y frijoles).</li>
        <li>Para atletas veganos o vegetarianos, simplemente se recomienda aumentar ligeramente la ingesta total de proteína para compensar.</li>
      </ul>
      
      <p>
        En conclusión, la proteína es tu aliada número uno para la recuperación y la adaptación al entrenamiento. No temas incluirla en cada comida y enfócate en la calidad y la cantidad total diaria, en lugar de preocuparte por mitos obsoletos.
      </p>
    `
  },
  {
    id: '2',
    slug: 'que-es-amrap',
    title: '¿Qué es el "AMRAP" y cómo te ayuda?',
    category: 'Entrenamiento',
    date: '25 de Octubre, 2025',
    author: 'Coach Carlos',
    image: 'https://placehold.co/1200x600/374151/FFFFFF?text=AMRAP',
    content: `
      <p>
        AMRAP significa "As Many Rounds/Reps As Possible" (Tantas Rondas/Repeticiones Como Sea Posible). Es uno de los formatos de entrenamiento más populares en CrossFit.
      </p>
      <h2>¿Cómo funciona?</h2>
      <p>
        Se te da un tiempo fijo (por ejemplo, 10 minutos) y una serie de ejercicios. Tu objetivo es completar tantas rondas o repeticiones como puedas en ese tiempo.
      </p>
      <h2>Beneficios del AMRAP</h2>
      <ul>
        <li>Mejora la resistencia cardiovascular y muscular</li>
        <li>Permite medir el progreso fácilmente</li>
        <li>Altamente escalable para todos los niveles</li>
        <li>Desarrolla fortaleza mental</li>
      </ul>
      <p>
        El AMRAP es perfecto para mejorar tu capacidad de trabajo y ver resultados medibles en cada sesión.
      </p>
    `
  },
  {
    id: '3',
    slug: 'errores-sentadillas',
    title: '3 Errores Comunes en Sentadillas',
    category: 'Técnica',
    date: '22 de Octubre, 2025',
    author: 'Coach Ana',
    image: 'https://placehold.co/1200x600/4b5563/FFFFFF?text=Squat',
    content: `
      <p>
        La sentadilla es uno de los movimientos fundamentales en CrossFit. Sin embargo, muchos atletas cometen errores que pueden limitar su progreso o causar lesiones.
      </p>
      <h2>Error 1: Rodillas colapsando hacia adentro</h2>
      <p>
        Esto pone estrés innecesario en las rodillas. Mantén las rodillas alineadas con los dedos de los pies durante todo el movimiento.
      </p>
      <h2>Error 2: No alcanzar la profundidad adecuada</h2>
      <p>
        Para una sentadilla completa, los pliegues de la cadera deben estar por debajo de las rodillas. Si no puedes lograrlo, trabaja en tu movilidad.
      </p>
      <h2>Error 3: Levantar los talones</h2>
      <p>
        Los talones deben permanecer en contacto con el suelo. Si se levantan, puede ser un problema de movilidad de tobillo o de técnica.
      </p>
      <blockquote>
        "La técnica adecuada es más importante que el peso que levantas. Domina el movimiento antes de cargar más."
      </blockquote>
    `
  }
];

// Artículos recientes para el sidebar
const recentPosts = [
  {
    slug: 'que-es-amrap',
    title: '¿Qué es el "AMRAP" y cómo te ayuda?',
    image: 'https://placehold.co/100x100/374151/FFFFFF?text=AMRAP'
  },
  {
    slug: 'errores-sentadillas',
    title: '[VIDEO] 3 Errores Comunes en Sentadillas',
    image: 'https://placehold.co/100x100/4b5563/FFFFFF?text=Squat'
  },
  {
    slug: 'importancia-sueno',
    title: 'La importancia del sueño en la recuperación',
    image: 'https://placehold.co/100x100/52525B/FFFFFF?text=Sueño'
  }
];

export default function BlogDetailPage({ params }) {
  // Buscar el post por slug
  const post = postsData.find(p => p.slug === params.slug);

  // Si no se encuentra el post, mostrar 404
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post no encontrado</h1>
          <Link href="/blog" className="text-avc-red hover:underline">
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-900 py-20 pt-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMNA PRINCIPAL DEL ARTÍCULO */}
          <article className="lg:col-span-2">
            
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-400 mb-4">
              <Link href="/blog" className="hover:text-avc-red">
                Blog
              </Link>
              <span className="mx-2">&gt;</span>
              <Link href="#" className="hover:text-avc-red">
                {post.category}
              </Link>
            </div>

            {/* Título del Artículo */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
              {post.title}
            </h1>

            {/* Metadatos */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="inline-block bg-avc-red text-white px-3 py-1 text-xs font-bold rounded-full uppercase">
                {post.category}
              </span>
              <span className="text-gray-400 text-sm">Publicado el {post.date}</span>
            </div>

            {/* Imagen Principal */}
            <div className="rounded-lg shadow-xl overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Contenido del Artículo */}
            <div 
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA al final del post */}
            <div className="mt-16 p-8 bg-gray-800 rounded-xl border-2 border-avc-red text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Listo para poner esto en práctica?
              </h3>
              <p className="text-gray-300 mb-6">
                Únete a AVC Fitness Center y comienza tu transformación hoy mismo.
              </p>
              <Link
                href="/unete"
                className="inline-block bg-avc-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                Únete Ahora
              </Link>
            </div>

            {/* Botón de Regresar */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-avc-red hover:text-white transition duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al Blog
              </Link>
            </div>

          </article>

          {/* BARRA LATERAL (SIDEBAR) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              
              {/* Widget de Artículos Recientes */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
                  Artículos <span className="text-avc-red">Recientes</span>
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((recentPost) => (
                    <Link 
                      key={recentPost.slug}
                      href={`/blog/${recentPost.slug}`}
                      className="flex items-center group"
                    >
                      <Image
                        src={recentPost.image}
                        alt={recentPost.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md object-cover mr-4"
                      />
                      <span className="text-gray-200 group-hover:text-avc-red transition duration-300">
                        {recentPost.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Widget de Categorías */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
                  <span className="text-avc-red">Categorías</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="#" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Nutrición
                  </Link>
                  <Link href="#" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Entrenamiento
                  </Link>
                  <Link href="#" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Técnica
                  </Link>
                  <Link href="#" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Bienestar
                  </Link>
                  <Link href="#" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Comunidad
                  </Link>
                </div>
              </div>

              {/* Widget de CTA */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-xl text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  ¿Listo para <span className="text-avc-red">empezar?</span>
                </h3>
                <p className="text-gray-300 mb-6">
                  Agenda tu clase de prueba gratis y vive la experiencia AVC.
                </p>
                <Link 
                  href="/unete" 
                  className="inline-block bg-avc-red text-white font-bold py-3 px-8 rounded-md shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
                >
                  ¡Únete Ahora!
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .prose-content h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 700;
          color: #f3f4f6;
          margin-top: 2em;
          margin-bottom: 1em;
          border-bottom: 1px solid #374151;
          padding-bottom: 0.25em;
        }
        .prose-content h3 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          color: #f3f4f6;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
        }
        .prose-content p {
          font-size: 1.125rem;
          line-height: 1.75rem;
          color: #d1d5db;
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }
        .prose-content a {
          color: #dc2626;
          text-decoration: none;
          font-weight: 500;
        }
        .prose-content a:hover {
          text-decoration: underline;
        }
        .prose-content ul {
          list-style-type: disc;
          margin-left: 1.25em;
          padding-left: 0.5em;
          color: #d1d5db;
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        .prose-content ul li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .prose-content blockquote {
          border-left: 4px solid #dc2626;
          padding-left: 1em;
          font-style: italic;
          font-size: 1.25rem;
          color: #f3f4f6;
          margin-top: 1.6em;
          margin-bottom: 1.6em;
        }
      `}</style>
    </main>
  );
}
