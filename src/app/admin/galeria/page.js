'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';

export default function AdminGaleriaPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galeria, setGaleria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    url: '',
    category: 'Instalaciones',
    order: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadGaleria();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadGaleria = async () => {
    try {
      const galeriaCol = collection(db, 'galeria');
      const galeriaSnapshot = await getDocs(galeriaCol);
      const galeriaList = galeriaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por orden y fecha
      galeriaList.sort((a, b) => (a.order || 0) - (b.order || 0));
      setGaleria(galeriaList);
    } catch (error) {
      console.error('Error al cargar galería:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        order: parseInt(formData.order) || 0,
      };

      if (editingItem) {
        const itemRef = doc(db, 'galeria', editingItem.id);
        await updateDoc(itemRef, dataToSave);
      } else {
        await addDoc(collection(db, 'galeria'), {
          ...dataToSave,
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadGaleria();
    } catch (error) {
      console.error('Error al guardar item:', error);
      alert('Error al guardar el item de galería');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'image',
      url: item.url || '',
      category: item.category || 'Instalaciones',
      order: item.order || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      try {
        await deleteDoc(doc(db, 'galeria', id));
        loadGaleria();
      } catch (error) {
        console.error('Error al eliminar item:', error);
        alert('Error al eliminar el item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'image',
      url: '',
      category: 'Instalaciones',
      order: 0,
    });
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

  const filteredGaleria = filterType === 'all' 
    ? galeria 
    : filterType === 'photo'
    ? galeria.filter(item => item.type === 'image' || item.type === 'photo')
    : galeria.filter(item => item.type === filterType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Header */}
      <AdminHeader 
        title="Gestión de Galería"
        subtitle="Administra fotos y videos de las instalaciones"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Action Buttons */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Item</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setFilterType('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
              filterType === 'all'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos ({galeria.length})
          </button>
          <button
            onClick={() => setFilterType('photo')}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
              filterType === 'photo'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            📷 Fotos ({galeria.filter(i => i.type === 'image' || i.type === 'photo').length})
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
              filterType === 'video'
                ? 'bg-avc-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎥 Videos ({galeria.filter(i => i.type === 'video').length})
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredGaleria.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGaleria.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-avc-red transition-all duration-300 group"
              >
                <div className="relative h-64 bg-gray-100">
                  {item.type === 'image' || item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Video</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black bg-opacity-75 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-avc-red text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                      #{item.order}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      {item.type === 'image' || item.type === 'photo' ? '📷 Foto' : '🎥 Video'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg">No hay items en la galería</p>
            <p className="text-gray-500 text-sm mt-2">Agrega fotos o videos para comenzar</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Editar Item' : 'Nuevo Item'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Área de CrossFit"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Describe la imagen o video..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="image">📷 Foto</option>
                    <option value="video">🎥 Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="Instalaciones">Instalaciones</option>
                    <option value="Clases">Clases</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Equipamiento">Equipamiento</option>
                    <option value="Comunidad">Comunidad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL {formData.type === 'image' ? 'de Imagen' : 'de Video'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder={formData.type === 'image' 
                    ? 'https://ejemplo.com/imagen.jpg' 
                    : 'https://www.youtube.com/embed/VIDEO_ID'
                  }
                />
                {formData.type === 'video' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Para YouTube, usa el formato: https://www.youtube.com/embed/VIDEO_ID
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Orden de visualización
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Los items se mostrarán en orden ascendente (0, 1, 2...)
                </p>
              </div>

              {formData.url && formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vista previa</label>
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '';
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-avc-red hover:bg-red-700 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  {editingItem ? 'Actualizar' : 'Crear'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
