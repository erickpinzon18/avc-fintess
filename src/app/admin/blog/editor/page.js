'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

export default function BlogEditorPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [editingId, setEditingId] = useState(null);
  const contentRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Cargar post si estamos editando
        const postId = searchParams.get('id');
        if (postId) {
          await loadPost(postId);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const loadPost = async (postId) => {
    try {
      const postRef = doc(db, 'blog', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        const postData = postSnap.data();
        setFormData({
          title: postData.title || '',
          slug: postData.slug || '',
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          author: postData.author || '',
          category: postData.category || 'Nutrición',
          image: postData.image || '',
          published: postData.published || false,
          featured: postData.featured || false,
        });
        setEditingId(postId);
        
        // Insertar contenido en el editor
        if (contentRef.current) {
          contentRef.current.innerHTML = postData.content || '';
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Error al cargar el artículo');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const insertHTML = (html) => {
    document.execCommand('insertHTML', false, html);
    contentRef.current?.focus();
  };

  const handleSave = async (publishNow = false) => {
    if (!formData.title || !formData.excerpt || !formData.author) {
      alert('Por favor completa título, extracto y autor');
      return;
    }

    setSaving(true);
    try {
      const content = contentRef.current?.innerHTML || '';
      
      const postData = {
        ...formData,
        content,
        slug: formData.slug || generateSlug(formData.title),
        published: publishNow ? true : formData.published,
        updatedAt: new Date(),
      };

      if (editingId) {
        // Actualizar
        const postRef = doc(db, 'blog', editingId);
        await updateDoc(postRef, postData);
        alert('Artículo actualizado exitosamente');
      } else {
        // Crear nuevo
        postData.createdAt = new Date();
        postData.publishedAt = publishNow ? new Date() : null;
        await addDoc(collection(db, 'blog'), postData);
        alert('Artículo creado exitosamente');
      }

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el artículo');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      insertHTML(`<img src="${url}" alt="Imagen" class="blog-image" />`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando editor...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header Fijo */}
      <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/blog')}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h1>
                <p className="text-sm text-gray-400">Editor de contenido</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Borrador'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título */}
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({ 
                    ...formData, 
                    title,
                    slug: generateSlug(title)
                  });
                }}
                placeholder="Título del artículo..."
                className="w-full text-4xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* Barra de Herramientas */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sticky top-24 z-40">
              <div className="flex flex-wrap gap-2">
                {/* Formato de texto */}
                <div className="flex items-center space-x-1 border-r border-gray-700 pr-2">
                  <button
                    onClick={() => execCommand('bold')}
                    className="p-2 hover:bg-gray-800 rounded transition"
                    title="Negrita (Ctrl+B)"
                  >
                    <span className="text-white font-bold">B</span>
                  </button>
                  <button
                    onClick={() => execCommand('italic')}
                    className="p-2 hover:bg-gray-800 rounded transition"
                    title="Cursiva (Ctrl+I)"
                  >
                    <span className="text-white italic">I</span>
                  </button>
                  <button
                    onClick={() => execCommand('underline')}
                    className="p-2 hover:bg-gray-800 rounded transition"
                    title="Subrayado (Ctrl+U)"
                  >
                    <span className="text-white underline">U</span>
                  </button>
                </div>

                {/* Encabezados */}
                <div className="flex items-center space-x-1 border-r border-gray-700 pr-2">
                  <button
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    className="px-3 py-2 hover:bg-gray-800 rounded transition text-white font-semibold"
                    title="Encabezado 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => execCommand('formatBlock', '<h3>')}
                    className="px-3 py-2 hover:bg-gray-800 rounded transition text-white font-semibold"
                    title="Encabezado 3"
                  >
                    H3
                  </button>
                  <button
                    onClick={() => execCommand('formatBlock', '<p>')}
                    className="px-3 py-2 hover:bg-gray-800 rounded transition text-white"
                    title="Párrafo"
                  >
                    P
                  </button>
                </div>

                {/* Listas */}
                <div className="flex items-center space-x-1 border-r border-gray-700 pr-2">
                  <button
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-2 hover:bg-gray-800 rounded transition text-white"
                    title="Lista con viñetas"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => execCommand('insertOrderedList')}
                    className="p-2 hover:bg-gray-800 rounded transition text-white"
                    title="Lista numerada"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>

                {/* Enlaces e Imágenes */}
                <div className="flex items-center space-x-1 border-r border-gray-700 pr-2">
                  <button
                    onClick={() => {
                      const url = prompt('URL del enlace:');
                      if (url) execCommand('createLink', url);
                    }}
                    className="p-2 hover:bg-gray-800 rounded transition text-white"
                    title="Insertar enlace"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button
                    onClick={handleImageUpload}
                    className="p-2 hover:bg-gray-800 rounded transition text-white"
                    title="Insertar imagen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                {/* Blockquote */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => execCommand('formatBlock', '<blockquote>')}
                    className="p-2 hover:bg-gray-800 rounded transition text-white"
                    title="Cita"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Editor de Contenido */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg">
              <div
                ref={contentRef}
                contentEditable
                className="prose-editor min-h-[600px] p-8 focus:outline-none text-gray-200"
                placeholder="Empieza a escribir tu artículo..."
                suppressContentEditableWarning
              />
            </div>
          </div>

          {/* Sidebar de Configuración */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Metadatos */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Configuración</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Autor</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-avc-red"
                      placeholder="Nombre del autor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-avc-red"
                    >
                      <option value="Nutrición">Nutrición</option>
                      <option value="Entrenamiento">Entrenamiento</option>
                      <option value="Salud">Salud</option>
                      <option value="Motivación">Motivación</option>
                      <option value="Técnica">Técnica</option>
                      <option value="Comunidad">Comunidad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-avc-red text-sm font-mono"
                      placeholder="url-del-articulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Extracto</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows="3"
                      maxLength="200"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-avc-red text-sm"
                      placeholder="Breve descripción (máx 200 caracteres)"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/200</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Imagen Principal (URL)</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-avc-red text-sm"
                      placeholder="https://..."
                    />
                    {formData.image && (
                      <div className="mt-3 rounded overflow-hidden">
                        <img src={formData.image} alt="Preview" className="w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <label className="flex items-center space-x-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 rounded focus:ring-yellow-600"
                      />
                      <span className="text-sm text-gray-300">⭐ Artículo destacado</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-400 mb-2">💡 Tips de Edición</h4>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>• Usa H2 para títulos principales</li>
                  <li>• Usa H3 para subtítulos</li>
                  <li>• Guarda borradores frecuentemente</li>
                  <li>• Las imágenes deben ser URLs públicas</li>
                  <li>• El extracto aparece en las tarjetas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .prose-editor {
          outline: none;
        }
        
        .prose-editor:empty:before {
          content: attr(placeholder);
          color: #6b7280;
          cursor: text;
        }
        
        .prose-editor h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #f3f4f6;
          margin-top: 2em;
          margin-bottom: 1em;
          border-bottom: 1px solid #374151;
          padding-bottom: 0.25em;
        }
        
        .prose-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f3f4f6;
          margin-top: 1.6em;
          margin-bottom: 0.6em;
        }
        
        .prose-editor p {
          font-size: 1.125rem;
          line-height: 1.75rem;
          color: #d1d5db;
          margin-top: 1.25em;
          margin-bottom: 1.25em;
        }
        
        .prose-editor ul, .prose-editor ol {
          margin-left: 1.25em;
          padding-left: 0.5em;
          color: #d1d5db;
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        
        .prose-editor li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        
        .prose-editor blockquote {
          border-left: 4px solid #dc2626;
          padding-left: 1em;
          font-style: italic;
          font-size: 1.25rem;
          color: #f3f4f6;
          margin-top: 1.6em;
          margin-bottom: 1.6em;
        }
        
        .prose-editor a {
          color: #dc2626;
          text-decoration: underline;
        }
        
        .prose-editor .blog-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
}
