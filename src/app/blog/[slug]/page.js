'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function BlogDetailPage({ params }) {
  const { slug } = use(params);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      // Buscar el post por slug
      const blogRef = collection(db, 'blog');
      const q = query(blogRef, where('slug', '==', slug), where('published', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const postData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        };
        setPost(postData);
        
        // Cargar posts relacionados (misma categoría)
        await loadRelatedPosts(postData.category, postData.id);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (category, currentPostId) => {
    try {
      const blogRef = collection(db, 'blog');
      const q = query(
        blogRef,
        where('published', '==', true),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.id !== currentPostId)
        .slice(0, 3);
      setRelatedPosts(posts);
    } catch (error) {
      console.error('Error loading related posts:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando artículo...</p>
        </div>
      </div>
    );
  }

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
              <span className="hover:text-avc-red">
                {post.category}
              </span>
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
              <span className="text-gray-400 text-sm">
                Publicado el{' '}
                {post.publishedAt?.toDate
                  ? post.publishedAt.toDate().toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Fecha no disponible'}
              </span>
              <span className="text-gray-400 text-sm">Por {post.author}</span>
            </div>

            {/* Imagen Principal */}
            {post.image && (
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
            )}

            {/* Contenido del Artículo */}
            <div 
              className="prose-content bg-gray-800 rounded-lg p-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Botón de Volver */}
            <div className="mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 text-avc-red hover:text-red-700 font-semibold transition duration-300"
              >
                <svg
                  className="w-5 h-5"
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
              
              {/* Widget de Artículos Relacionados */}
              {relatedPosts.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
                    Artículos <span className="text-avc-red">Relacionados</span>
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link 
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="flex items-center group"
                      >
                        {relatedPost.image && (
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                          />
                        )}
                        <span className="text-gray-200 group-hover:text-avc-red transition duration-300 text-sm line-clamp-2">
                          {relatedPost.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget de Categorías */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
                  <span className="text-avc-red">Categorías</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Nutrición
                  </Link>
                  <Link href="/blog" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Entrenamiento
                  </Link>
                  <Link href="/blog" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Salud
                  </Link>
                  <Link href="/blog" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
                    Motivación
                  </Link>
                  <Link href="/blog" className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-full hover:bg-avc-red hover:text-white transition duration-300">
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
        .prose-content ul, .prose-content ol {
          list-style-type: disc;
          margin-left: 1.25em;
          padding-left: 0.5em;
          color: #d1d5db;
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        .prose-content ul li, .prose-content ol li {
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
          background: rgba(220, 38, 38, 0.05);
          padding: 1em;
          border-radius: 0.25rem;
        }
      `}</style>
    </main>
  );
}
