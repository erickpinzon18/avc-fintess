'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '@/lib/storage';
import Image from 'next/image';
import AdminHeader from '../components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';

export default function AdminClasesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clases, setClases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClase, setEditingClase] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target: '',
    benefits: '',
    price: '',
    promo: '',
    image: '',
    freeTrial: false,
    trialPrice: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadClases();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const loadClases = async () => {
    try {
      const clasesCol = collection(db, 'clases');
      const clasesSnapshot = await getDocs(clasesCol);
      const clasesList = clasesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClases(clasesList);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      
      // Normalizar el nombre de la clase para usarlo en la ruta
      const className = formData.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // Subir imagen de portada si hay un archivo nuevo
      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          'clases',
          className,
          'portada.jpg'
        );
      } else if (!imageUrl) {
        // Si no hay imagen, generar URL de placeholder
        const placeholderText = encodeURIComponent(formData.name);
        imageUrl = `https://placehold.co/1920x600/1f2937/ffffff?text=${placeholderText}&font=montserrat`;
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
      };

      if (editingClase) {
        // Actualizar clase existente
        const claseRef = doc(db, 'clases', editingClase.id);
        await updateDoc(claseRef, dataToSave);
      } else {
        // Crear nueva clase
        await addDoc(collection(db, 'clases'), {
          ...dataToSave,
          createdAt: new Date(),
        });
      }
      
      setShowModal(false);
      setEditingClase(null);
      setImageFile(null);
      resetForm();
      loadClases();
    } catch (error) {
      console.error('Error al guardar clase:', error);
      alert('Error al guardar la clase: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (clase) => {
    console.log('🔧 handleEdit - clase completa:', clase);
    setEditingClase(clase);
    const newFormData = {
      name: clase.name || '',
      description: clase.description || '',
      target: clase.target || '',
      benefits: clase.benefits || '',
      price: clase.price || '',
      promo: clase.promo || '',
      image: clase.image || '',
      freeTrial: clase.freeTrial || false,
      trialPrice: clase.trialPrice || '',
    };
    console.log('📝 handleEdit - formData nuevo:', newFormData);
    setFormData(newFormData);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta clase?')) {
      try {
        await deleteDoc(doc(db, 'clases', id));
        loadClases();
      } catch (error) {
        console.error('Error al eliminar clase:', error);
        alert('Error al eliminar la clase');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      target: '',
      benefits: '',
      price: '',
      promo: '',
      image: '',
      freeTrial: false,
      trialPrice: '',
    });
    setImageFile(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Header */}
      <AdminHeader 
        title="Administrar Clases"
        subtitle="Gestiona todas las clases y actividades"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar Clases</h2>
          <p className="text-gray-600">Gestiona las clases, disciplinas y actividades disponibles en el gimnasio</p>
        </div>

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
              setEditingClase(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Clase</span>
          </button>
        </div>

        {/* Clases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clases.map((clase) => (
            <div key={clase.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-avc-red transition-all duration-300">
              <div className="relative h-48">
                {clase.image ? (
                  <Image
                    src={clase.image}
                    alt={clase.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4">{clase.name}</h3>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{clase.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{clase.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-avc-red font-semibold text-sm">{clase.price}</span>
                  {clase.freeTrial && (
                    <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Clase Gratis</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(clase)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(clase.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clases.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No hay clases registradas</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-avc-red hover:bg-red-700 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Crear Primera Clase
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
          style={{ zIndex: 9998 }}
        >
          {/* Overlay de fondo */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setShowModal(false);
              setEditingClase(null);
              resetForm();
            }}
          ></div>
          
          {/* Contenido del modal */}
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClase ? 'Editar Clase' : 'Nueva Clase'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingClase(null);
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Clase</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: CrossFit"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Describe la clase..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dirigido a</label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Todos los niveles"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Beneficios</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Fuerza, resistencia, técnica"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Individual: $80 | Mensual: $850"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Promoción (opcional)</label>
                <input
                  type="text"
                  value={formData.promo}
                  onChange={(e) => setFormData({ ...formData, promo: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: 2x1 este mes"
                />
              </div>

              {/* Imagen de Portada */}
              <ImageUploader
                label="Imagen de Portada"
                currentImage={formData.image}
                onImageSelect={(file) => {
                  setImageFile(file);
                  if (file === null) {
                    // Si se elimina la imagen, limpiar también en formData
                    setFormData({ ...formData, image: '' });
                  }
                }}
                height="h-48"
                helpText="Imagen principal de la clase"
              />

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.freeTrial}
                    onChange={(e) => setFormData({ ...formData, freeTrial: e.target.checked })}
                    className="w-5 h-5 text-avc-red bg-gray-100 border-gray-300 rounded focus:ring-avc-red"
                  />
                  <span className="text-gray-700">Clase muestra gratis</span>
                </label>

                {formData.freeTrial && (
                  <input
                    type="text"
                    value={formData.trialPrice}
                    onChange={(e) => setFormData({ ...formData, trialPrice: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="Precio de clase muestra (opcional)"
                  />
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingClase(null);
                    resetForm();
                  }}
                  disabled={uploading}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-avc-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>{editingClase ? 'Actualizar' : 'Crear'} Clase</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
