'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import AdminHeader from '../components/AdminHeader';

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
    try {
      const certArray = formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert);
      
      const coachData = {
        ...formData,
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
      resetForm();
      loadCoaches();
    } catch (error) {
      console.error('Error al guardar coach:', error);
      alert('Error al guardar el coach');
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
                <Image
                  src={coach.image || 'https://placehold.co/300x300/333333/white?text=Coach'}
                  alt={coach.name}
                  fill
                  className="object-cover"
                />
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(coach.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL de Imagen</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="https://ejemplo.com/foto-coach.jpg"
                />
              </div>

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
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-avc-red hover:bg-red-700 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  {editingCoach ? 'Actualizar' : 'Crear'} Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
