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

export default function AdminCoachesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    image: '',
    certifications: '',
    email: '',
    instagram: '',
    experience: '',
    achievements: '',
    philosophy: '',
    favoriteExercise: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadCoaches();
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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const loadCoaches = async () => {
    try {
      const coachesCol = collection(db, 'coaches');
      const coachesSnapshot = await getDocs(coachesCol);
      const coachesList = coachesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoaches(coachesList);
    } catch (error) {
      console.error('Error al cargar coaches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      
      // Normalizar el nombre del coach para usarlo en la ruta
      const coachName = formData.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // Subir imagen si hay un archivo nuevo
      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          'coaches',
          coachName,
          'perfil.jpg'
        );
      } else if (!imageUrl) {
        // Si no hay imagen, generar URL de placeholder
        const placeholderText = encodeURIComponent(formData.name);
        imageUrl = `https://placehold.co/800x600/1f2937/ffffff?text=${placeholderText}&font=montserrat`;
      }

      const certArray = formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert);
      
      const coachData = {
        ...formData,
        image: imageUrl,
        certifications: certArray,
      };

      if (editingCoach) {
        const coachRef = doc(db, 'coaches', editingCoach.id);
        await updateDoc(coachRef, {
          ...coachData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'coaches'), {
          ...coachData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      
      setShowModal(false);
      setEditingCoach(null);
      setImageFile(null);
      resetForm();
      loadCoaches();
    } catch (error) {
      console.error('Error al guardar coach:', error);
      alert('Error al guardar el coach: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name || '',
      specialty: coach.specialty || '',
      bio: coach.bio || '',
      image: coach.image || '',
      certifications: Array.isArray(coach.certifications) ? coach.certifications.join(', ') : '',
      email: coach.email || '',
      instagram: coach.instagram || '',
      experience: coach.experience || '',
      achievements: coach.achievements || '',
      philosophy: coach.philosophy || '',
      favoriteExercise: coach.favoriteExercise || '',
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este coach?')) {
      try {
        await deleteDoc(doc(db, 'coaches', id));
        loadCoaches();
      } catch (error) {
        console.error('Error al eliminar coach:', error);
        alert('Error al eliminar el coach');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      bio: '',
      image: '',
      certifications: '',
      email: '',
      instagram: '',
      experience: '',
      achievements: '',
      philosophy: '',
      favoriteExercise: '',
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
      <AdminHeader 
        title="Administrar Coaches"
        subtitle="Gestiona el equipo de entrenadores"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar Coaches</h2>
          <p className="text-gray-600">Gestiona tu equipo de entrenadores y sus perfiles</p>
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
              setEditingCoach(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Coach</span>
          </button>
        </div>
        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <div key={coach.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-avc-red transition-all duration-300">
              <div className="relative h-64">
                {coach.image ? (
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4">{coach.name}</h3>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
                <p className="text-avc-red text-sm font-semibold mb-3">{coach.specialty}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{coach.bio}</p>
                
                {coach.certifications && coach.certifications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Certificaciones:</p>
                    <div className="flex flex-wrap gap-1">
                      {coach.certifications.map((cert, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(coach.email || coach.instagram) && (
                  <div className="mb-4 text-xs text-gray-500">
                    {coach.email && <p>📧 {coach.email}</p>}
                    {coach.instagram && <p>📱 {coach.instagram}</p>}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(coach)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(coach.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {coaches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No hay coaches registrados</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-avc-red hover:bg-red-700 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Crear Primer Coach
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
              setEditingCoach(null);
              resetForm();
            }}
          ></div>
          
          {/* Contenido del modal */}
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoach ? 'Editar Coach' : 'Nuevo Coach'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCoach(null);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="CrossFit Level 2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Entrenador certificado con 5 años de experiencia..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Años de Experiencia</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="5 años"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logros Destacados</label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Campeón Regional CrossFit 2023, Entrenador del año..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filosofía de Entrenamiento</label>
                <textarea
                  value={formData.philosophy}
                  onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Mi enfoque se centra en..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ejercicio Favorito</label>
                <input
                  type="text"
                  value={formData.favoriteExercise}
                  onChange={(e) => setFormData({ ...formData, favoriteExercise: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Clean & Jerk"
                />
              </div>

              {/* Imagen del Coach */}
              <ImageUploader
                label="Foto del Coach"
                currentImage={formData.image}
                onImageSelect={(file) => {
                  setImageFile(file);
                  if (file === null) {
                    // Si se elimina la imagen, limpiar también en formData
                    setFormData({ ...formData, image: '' });
                  }
                }}
                height="h-80"
                helpText="Foto profesional del coach"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certificaciones <span className="text-gray-500 text-xs">(separadas por comas)</span>
                </label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="CrossFit Level 2, Halterofilia USA, Nutrición Deportiva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="coach@avcfitness.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="@coachusername"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoach(null);
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
                    <>{editingCoach ? 'Actualizar' : 'Crear'} Coach</>
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
