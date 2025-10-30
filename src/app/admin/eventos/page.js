'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminEventosPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    image: '',
    category: 'Competencia',
    registrationLink: '',
    capacity: '',
    location: 'AVC Fitness Center',
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadEventos();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadEventos = async () => {
    try {
      const eventosCol = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosCol);
      const eventosList = eventosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por fecha (más recientes primero)
      eventosList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEventos(eventosList);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvento) {
        const eventoRef = doc(db, 'eventos', editingEvento.id);
        await updateDoc(eventoRef, formData);
      } else {
        await addDoc(collection(db, 'eventos'), {
          ...formData,
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingEvento(null);
      resetForm();
      loadEventos();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      alert('Error al guardar el evento');
    }
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setFormData({
      title: evento.title || '',
      date: evento.date || '',
      time: evento.time || '',
      description: evento.description || '',
      image: evento.image || '',
      category: evento.category || 'Competencia',
      registrationLink: evento.registrationLink || '',
      capacity: evento.capacity || '',
      location: evento.location || 'AVC Fitness Center',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await deleteDoc(doc(db, 'eventos', id));
        loadEventos();
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('Error al eliminar el evento');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      description: '',
      image: '',
      category: 'Competencia',
      registrationLink: '',
      capacity: '',
      location: 'AVC Fitness Center',
    });
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
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

  const eventosProximos = eventos.filter((e) => isUpcoming(e.date));
  const eventosPasados = eventos.filter((e) => !isUpcoming(e.date));

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
                <h1 className="text-2xl font-bold text-white">Gestión de Eventos</h1>
                <p className="text-sm text-gray-400">Administra competencias y actividades especiales</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingEvento(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Evento</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Eventos Próximos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Próximos Eventos ({eventosProximos.length})</h2>
          {eventosProximos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosProximos.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-avc-red transition-all duration-300"
                >
                  {evento.image && (
                    <div className="relative h-48 bg-gray-800">
                      <img
                        src={evento.image}
                        alt={evento.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-avc-red text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {evento.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{evento.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(evento.date).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {evento.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {evento.location}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{evento.description}</p>
                    {evento.capacity && (
                      <p className="text-gray-400 text-xs mb-4">Capacidad: {evento.capacity} personas</p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
              <p className="text-gray-400 text-lg">No hay eventos próximos</p>
            </div>
          )}
        </div>

        {/* Eventos Pasados */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Eventos Pasados ({eventosPasados.length})</h2>
          {eventosPasados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosPasados.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300"
                >
                  {evento.image && (
                    <div className="relative h-48 bg-gray-800">
                      <img
                        src={evento.image}
                        alt={evento.title}
                        className="w-full h-full object-cover grayscale"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {evento.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{evento.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(evento.date).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{evento.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
              <p className="text-gray-400 text-lg">No hay eventos pasados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingEvento ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingEvento(null);
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
                <label className="block text-sm font-semibold text-gray-300 mb-2">Título del Evento</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: Competencia de CrossFit 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Hora</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Describe el evento..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="Competencia">Competencia</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Clase Especial">Clase Especial</option>
                    <option value="Evento Social">Evento Social</option>
                    <option value="Seminario">Seminario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Capacidad</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="Número de personas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Ej: AVC Fitness Center"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Link de Registro (opcional)</label>
                <input
                  type="url"
                  value={formData.registrationLink}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="https://forms.google.com/..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvento(null);
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
                  {editingEvento ? 'Actualizar' : 'Crear'} Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
