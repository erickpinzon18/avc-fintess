'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminTestimoniosPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testimonios, setTestimonios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonio, setEditingTestimonio] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    memberSince: '',
    testimonial: '',
    image: '',
    rating: 5,
    program: '',
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadTestimonios();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadTestimonios = async () => {
    try {
      const testimoniosCol = collection(db, 'testimonios');
      const testimoniosSnapshot = await getDocs(testimoniosCol);
      const testimoniosList = testimoniosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonios(testimoniosList);
    } catch (error) {
      console.error('Error al cargar testimonios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonio) {
        const testimonioRef = doc(db, 'testimonios', editingTestimonio.id);
        await updateDoc(testimonioRef, formData);
      } else {
        await addDoc(collection(db, 'testimonios'), {
          ...formData,
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingTestimonio(null);
      resetForm();
      loadTestimonios();
    } catch (error) {
      console.error('Error al guardar testimonio:', error);
      alert('Error al guardar el testimonio');
    }
  };

  const handleEdit = (testimonio) => {
    setEditingTestimonio(testimonio);
    setFormData({
      name: testimonio.name || '',
      memberSince: testimonio.memberSince || '',
      testimonial: testimonio.testimonial || '',
      image: testimonio.image || '',
      rating: testimonio.rating || 5,
      program: testimonio.program || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este testimonio?')) {
      try {
        await deleteDoc(doc(db, 'testimonios', id));
        loadTestimonios();
      } catch (error) {
        console.error('Error al eliminar testimonio:', error);
        alert('Error al eliminar el testimonio');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      memberSince: '',
      testimonial: '',
      image: '',
      rating: 5,
      program: '',
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
                <h1 className="text-2xl font-bold text-white">Administrar Testimonios</h1>
                <p className="text-sm text-gray-400">Gestiona testimonios y transformaciones de clientes</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingTestimonio(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Testimonio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonios.map((testimonio) => (
            <div key={testimonio.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-avc-red transition-all duration-300 border-l-4 border-l-avc-red">
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={testimonio.image || 'https://placehold.co/200x200/333333/white?text=User'}
                    alt={testimonio.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{testimonio.name}</h3>
                  <p className="text-gray-400 text-sm">Miembro desde {testimonio.memberSince}</p>
                  <p className="text-avc-red text-sm">{testimonio.program}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-3">
                {[...Array(testimonio.rating || 5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-300 italic mb-4">&quot;{testimonio.testimonial}&quot;</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(testimonio)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(testimonio.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {testimonios.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No hay testimonios registrados</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Crear Primer Testimonio
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingTestimonio ? 'Editar Testimonio' : 'Nuevo Testimonio'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTestimonio(null);
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
                <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre del Cliente</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ana García"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Miembro Desde</label>
                  <input
                    type="text"
                    value={formData.memberSince}
                    onChange={(e) => setFormData({ ...formData, memberSince: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Programa</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="CrossFit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Testimonio</label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="AVC cambió mi vida completamente..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">URL de Imagen</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Calificación (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
                  <option value={3}>⭐⭐⭐ (3 estrellas)</option>
                  <option value={2}>⭐⭐ (2 estrellas)</option>
                  <option value={1}>⭐ (1 estrella)</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTestimonio(null);
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
                  {editingTestimonio ? 'Actualizar' : 'Crear'} Testimonio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
