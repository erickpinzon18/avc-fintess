'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';

export default function AdminBlogPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadPosts();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadPosts = async () => {
    try {
      const postsCol = collection(db, 'blog');
      const postsSnapshot = await getDocs(postsCol);
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por fecha de creación (más recientes primero)
      postsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setPosts(postsList);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      try {
        await deleteDoc(doc(db, 'blog', id));
        loadPosts();
      } catch (error) {
        console.error('Error al eliminar post:', error);
        alert('Error al eliminar el post');
      }
    }
  };

  const togglePublished = async (post) => {
    try {
      const postRef = doc(db, 'blog', post.id);
      await updateDoc(postRef, {
        published: !post.published,
        publishedAt: !post.published ? new Date() : post.publishedAt,
      });
      loadPosts();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del post');
    }
  };

  const toggleFeatured = async (post) => {
    try {
      const postRef = doc(db, 'blog', post.id);
      await updateDoc(postRef, {
        featured: !post.featured,
      });
      loadPosts();
    } catch (error) {
      console.error('Error al cambiar destacado:', error);
      alert('Error al cambiar el estado destacado');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filtrar posts según el estado seleccionado
  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'published') return post.published;
    if (filterStatus === 'draft') return !post.published;
    return true; // 'all'
  });

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;
  const featuredCount = posts.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        title="Gestión del Blog"
        subtitle="Crea y edita artículos para el blog"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar Blog</h2>
          <p className="text-gray-600">Gestiona tus artículos, publicaciones y contenido del blog</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
          <button
            onClick={() => router.push('/admin/blog/editor')}
            className="bg-avc-red hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Artículo</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Total de Artículos</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-30 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium mb-1">Publicados</p>
                <p className="text-3xl font-bold">{publishedCount}</p>
              </div>
              <div className="bg-green-500 bg-opacity-30 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-1">Borradores</p>
                <p className="text-3xl font-bold">{draftCount}</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-30 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium mb-1">Destacados</p>
                <p className="text-3xl font-bold">{featuredCount}</p>
              </div>
              <div className="bg-purple-500 bg-opacity-30 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'all'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'published'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Publicados ({publishedCount})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'draft'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Borradores ({draftCount})
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Artículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className="text-lg font-semibold text-gray-700">No hay artículos</p>
                        <p className="text-sm mt-1 text-gray-600">Crea tu primer artículo usando el botón "Nuevo Artículo"</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-900 font-semibold">{post.title}</p>
                              {post.featured && (
                                <span className="text-yellow-500" title="Destacado">
                                  ⭐
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-1">{post.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {post.author || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition ${
                            post.published
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {post.published ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Publicado
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                              Borrador
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {post.createdAt?.toDate
                          ? post.createdAt.toDate().toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(post)}
                            className={`p-2 rounded-lg transition ${
                              post.featured
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            title={post.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => router.push(`/admin/blog/editor?id=${post.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
