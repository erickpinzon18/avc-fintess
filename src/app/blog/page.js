import Link from 'next/link';
import Image from 'next/image';

// Datos estáticos por ahora (después conectaremos con Firebase)
const blogPosts = [
  {
    id: '1',
    slug: 'mitos-proteina-crossfit',
    title: 'Los 5 Mitos Más Comunes sobre la Proteína y el CrossFit',
    excerpt:
      'Descubre la verdad sobre la proteína y desmiente los mitos más comunes en el mundo del fitness.',
    imageUrl: 'https://placehold.co/800x400/dc2626/white?text=Mitos+Proteina',
    category: 'Nutrición',
    publishedAt: '2025-10-28',
    author: 'Ana Rodríguez',
  },
  {
    id: '2',
    slug: 'beneficios-crossfit',
    title: '5 Beneficios del CrossFit que no conocías',
    excerpt:
      'Descubre cómo el CrossFit puede transformar no solo tu cuerpo, sino también tu mentalidad y estilo de vida.',
    imageUrl: 'https://placehold.co/800x400/1a1a1a/white?text=CrossFit+Benefits',
    category: 'Entrenamiento',
    publishedAt: '2025-10-15',
    author: 'Carlos Mendoza',
  },
  {
    id: '3',
    slug: 'nutricion-para-atletas',
    title: 'Guía de Nutrición para Atletas de CrossFit',
    excerpt:
      'Aprende qué comer antes y después del entrenamiento para maximizar tus resultados.',
    imageUrl: 'https://placehold.co/800x400/333333/white?text=Nutrition+Guide',
    category: 'Nutrición',
    publishedAt: '2025-10-10',
    author: 'Ana Rodríguez',
  },
  {
    id: '4',
    slug: 'importancia-movilidad',
    title: 'Por qué la Movilidad es Clave en tu Entrenamiento',
    excerpt:
      'La flexibilidad y movilidad son fundamentales para prevenir lesiones y mejorar el rendimiento.',
    imageUrl: 'https://placehold.co/800x400/555555/white?text=Mobility',
    category: 'Salud',
    publishedAt: '2025-10-05',
    author: 'María Sánchez',
  },
  {
    id: '5',
    slug: 'comunidad-avc',
    title: 'El Poder de la Comunidad en AVC Fitness',
    excerpt:
      'Cómo entrenar en grupo puede multiplicar tus resultados y hacer el proceso más divertido.',
    imageUrl: 'https://placehold.co/800x400/444444/white?text=Community',
    category: 'Motivación',
    publishedAt: '2025-09-28',
    author: 'Luis Gómez',
  },
  {
    id: '6',
    slug: 'que-es-amrap',
    title: '¿Qué es el AMRAP y cómo te ayuda?',
    excerpt:
      'Entiende este formato de entrenamiento y cómo puede llevar tu rendimiento al siguiente nivel.',
    imageUrl: 'https://placehold.co/800x400/666666/white?text=AMRAP',
    category: 'Entrenamiento',
    publishedAt: '2025-09-20',
    author: 'Carlos Mendoza',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Blog+AVC+Fitness"
            alt="Blog AVC"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Blog <span className="text-avc-red">AVC Fitness</span>
          </h1>
          <p className="text-xl text-gray-200">
            Consejos, tips y noticias para maximizar tu rendimiento y bienestar.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          {/* Grid de Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-avc-red"
              >
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-avc-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-avc-red transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
