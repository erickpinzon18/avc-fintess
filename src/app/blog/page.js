'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const blogRef = collection(db, 'blog');
      // Primero intentar con orderBy
      let q = query(
        blogRef,
        where('published', '==', true),
        orderBy('publishedAt', 'desc')
      );
      
      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        // Si falla por falta de índice, intentar sin orderBy
        console.log('Usando query sin orderBy debido a:', indexError.message);
        q = query(blogRef, where('published', '==', true));
        querySnapshot = await getDocs(q);
      }
      
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Ordenar manualmente por publishedAt
      posts.sort((a, b) => {
        const dateA = a.publishedAt?.toDate ? a.publishedAt.toDate() : new Date(a.publishedAt || 0);
        const dateB = b.publishedAt?.toDate ? b.publishedAt.toDate() : new Date(b.publishedAt || 0);
        return dateB - dateA;
      });
      
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      alert('Error al cargar los artículos. Verifica la consola.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías únicas
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  // Filtrar posts por categoría
  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Separar post destacado
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);
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
          {/* Filtros de Categoría */}
          <div className="mb-12 flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-avc-red text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando artículos...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No hay artículos disponibles</h2>
              <p className="text-gray-500">Pronto publicaremos contenido nuevo</p>
            </div>
          ) : (
            <>
              {/* Post Destacado */}
              {featuredPost && selectedCategory === 'all' && (
                <div className="mb-16">
                  <div className="flex items-center space-x-2 mb-6">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Artículo Destacado</h2>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group block bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-yellow-600"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative h-80 md:h-full">
                        <Image
                          src={featuredPost.image || 'https://placehold.co/800x400'}
                          alt={featuredPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            ⭐ Destacado
                          </span>
                          <span className="bg-avc-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {featuredPost.category}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-avc-red transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-gray-400 mb-6 text-lg">{featuredPost.excerpt}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="font-semibold">{featuredPost.author}</span>
                          <span>
                            {featuredPost.publishedAt?.toDate
                              ? featuredPost.publishedAt.toDate().toLocaleDateString('es-MX', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Fecha no disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid de Posts Regulares */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-avc-red"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image || 'https://placehold.co/800x400'}
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
                        <span>
                          {post.publishedAt?.toDate
                            ? post.publishedAt.toDate().toLocaleDateString('es-MX')
                            : 'Fecha no disponible'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
