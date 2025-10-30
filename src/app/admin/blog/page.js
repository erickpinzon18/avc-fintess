'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminBlogPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Nutrición',
    image: '',
    published: false,
    featured: false,
  });
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
        const dateA = a.publishedAt?.toDate ? a.publishedAt.toDate() : new Date(a.publishedAt || 0);
        const dateB = b.publishedAt?.toDate ? b.publishedAt.toDate() : new Date(b.publishedAt || 0);
        return dateB - dateA;
      });
      setPosts(postsList);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        published: formData.published,
        featured: formData.featured,
      };

      if (editingPost) {
        const postRef = doc(db, 'blog', editingPost.id);
        await updateDoc(postRef, {
          ...dataToSave,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'blog'), {
          ...dataToSave,
          publishedAt: new Date(),
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingPost(null);
      resetForm();
      loadPosts();
    } catch (error) {
      console.error('Error al guardar post:', error);
      alert('Error al guardar el post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      category: post.category || 'Nutrición',
      image: post.image || '',
      published: post.published || false,
      featured: post.featured || false,
    });
    setShowModal(true);
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

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Nutrición',
      image: '',
      published: false,
      featured: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const publishedPosts = posts.filter(p => p.published);
  const draftPosts = posts.filter(p => !p.published);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión del Blog</h1>
                <p className="text-sm text-gray-400">Crea y edita artículos para el blog</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingPost(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Artículo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Artículos</p>
                <p className="text-3xl font-bold text-white">{posts.length}</p>
              </div>
              <div className="bg-blue-900 bg-opacity-50 p-3 rounded-lg">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Publicados</p>
                <p className="text-3xl font-bold text-white">{publishedPosts.length}</p>
              </div>
              <div className="bg-green-900 bg-opacity-50 p-3 rounded-lg">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Borradores</p>
                <p className="text-3xl font-bold text-white">{draftPosts.length}</p>
              </div>
              <div className="bg-yellow-900 bg-opacity-50 p-3 rounded-lg">
                <span className="text-3xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Published Posts */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Artículos Publicados ({publishedPosts.length})</h2>
          {publishedPosts.length > 0 ? (
            <div className="space-y-4">
              {publishedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-avc-red transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    {post.image && (
                      <div className="w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{post.title}</h3>
                            {post.featured && (
                              <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                ⭐ Destacado
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="bg-gray-800 px-2 py-1 rounded">{post.category}</span>
                            <span>Por {post.author}</span>
                            <span>
                              {post.publishedAt?.toDate
                                ? post.publishedAt.toDate().toLocaleDateString('es-MX')
                                : new Date(post.publishedAt).toLocaleDateString('es-MX')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => togglePublished(post)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Despublicar
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
              <p className="text-gray-400 text-lg">No hay artículos publicados</p>
            </div>
          )}
        </div>

        {/* Draft Posts */}
        {draftPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Borradores ({draftPosts.length})</h2>
            <div className="space-y-4">
              {draftPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 p-6 opacity-75 hover:opacity-100 hover:border-yellow-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{post.title}</h3>
                        <span className="bg-yellow-800 text-white px-2 py-1 rounded text-xs font-semibold">
                          📄 Borrador
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="bg-gray-800 px-2 py-1 rounded">{post.category}</span>
                        <span>Por {post.author}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => togglePublished(post)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPost(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Título del Artículo</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: 10 Consejos para Mejorar tu Rendimiento"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="10-consejos-mejorar-rendimiento"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se genera automáticamente del título, pero puedes personalizarlo
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Extracto/Resumen</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows="2"
                  maxLength="200"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Un breve resumen del artículo (máx. 200 caracteres)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/200 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Contenido</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="12"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red font-mono text-sm"
                  placeholder="Escribe el contenido completo del artículo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Autor</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="Nombre del autor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="Nutrición">Nutrición</option>
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Bienestar">Bienestar</option>
                    <option value="Motivación">Motivación</option>
                    <option value="Recuperación">Recuperación</option>
                    <option value="Noticias">Noticias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">URL de Imagen Principal</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-5 h-5 text-avc-red bg-gray-800 border-gray-700 rounded focus:ring-avc-red"
                  />
                  <span className="text-gray-300 font-semibold">Publicar ahora</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-yellow-600 bg-gray-800 border-gray-700 rounded focus:ring-yellow-600"
                  />
                  <span className="text-gray-300 font-semibold">⭐ Artículo destacado</span>
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-avc-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  {editingPost ? 'Actualizar' : 'Crear'} Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
