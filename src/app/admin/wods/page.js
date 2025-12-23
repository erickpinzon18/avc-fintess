'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';

const MODALIDADES = ['For Time', 'AMRAP', 'EMOM', 'For Load', 'Tabata', 'Chipper', 'Hero WOD'];

export default function AdminWodsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wods, setWods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWod, setEditingWod] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    modalidad: 'For Time',
    fecha: '',
    timeCap: '',
    ejercicios: [{ nombre: '', cantidad: '', peso: '' }],
    notas: '',
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadWods();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadWods = async () => {
    try {
      const calendarioCol = collection(db, 'calendario');
      const wodsQuery = query(calendarioCol, where('tipo', '==', 'wod'));
      const wodsSnapshot = await getDocs(wodsQuery);
      const wodsList = wodsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate ? doc.data().fecha.toDate() : new Date(doc.data().fecha),
      }));
      // Ordenar por fecha (más recientes primero)
      wodsList.sort((a, b) => b.fecha - a.fecha);
      setWods(wodsList);
    } catch (error) {
      console.error('Error al cargar WODs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear fecha en zona horaria local
      const [year, month, day] = formData.fecha.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);
      fechaLocal.setHours(0, 0, 0, 0);

      const dataToSave = {
        tipo: 'wod',
        titulo: formData.titulo,
        modalidad: formData.modalidad,
        fecha: Timestamp.fromDate(fechaLocal),
        fechaString: formData.fecha,
        ejercicios: formData.ejercicios.filter(ej => ej.nombre && ej.cantidad),
        timeCap: formData.timeCap ? parseInt(formData.timeCap) : null,
        notas: formData.notas || '',
      };

      if (editingWod) {
        const wodRef = doc(db, 'calendario', editingWod.id);
        await updateDoc(wodRef, {
          ...dataToSave,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, 'calendario'), {
          ...dataToSave,
          createdAt: Timestamp.now(),
        });
      }

      setShowModal(false);
      setEditingWod(null);
      resetForm();
      loadWods();
    } catch (error) {
      console.error('Error al guardar WOD:', error);
      alert('Error al guardar el WOD');
    }
  };

  const handleEdit = (wod) => {
    setEditingWod(wod);
    const fecha = wod.fecha instanceof Date ? wod.fecha : new Date(wod.fecha);
    setFormData({
      titulo: wod.titulo || '',
      modalidad: wod.modalidad || 'For Time',
      fecha: fecha.toISOString().split('T')[0],
      timeCap: wod.timeCap || '',
      ejercicios: wod.ejercicios?.length > 0 ? wod.ejercicios : [{ nombre: '', cantidad: '', peso: '' }],
      notas: wod.notas || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este WOD?')) {
      try {
        await deleteDoc(doc(db, 'calendario', id));
        loadWods();
      } catch (error) {
        console.error('Error al eliminar WOD:', error);
        alert('Error al eliminar el WOD');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      modalidad: 'For Time',
      fecha: new Date().toISOString().split('T')[0],
      timeCap: '',
      ejercicios: [{ nombre: '', cantidad: '', peso: '' }],
      notas: '',
    });
  };

  const addEjercicio = () => {
    setFormData({
      ...formData,
      ejercicios: [...formData.ejercicios, { nombre: '', cantidad: '', peso: '' }],
    });
  };

  const removeEjercicio = (index) => {
    const newEjercicios = formData.ejercicios.filter((_, i) => i !== index);
    setFormData({ ...formData, ejercicios: newEjercicios });
  };

  const updateEjercicio = (index, field, value) => {
    const newEjercicios = [...formData.ejercicios];
    newEjercicios[index][field] = value;
    setFormData({ ...formData, ejercicios: newEjercicios });
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
      <AdminHeader 
        title="WODs del Día"
        subtitle="Gestiona los entrenamientos diarios (Workout of the Day)"
      />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar WODs</h2>
          <p className="text-gray-600">Crea y gestiona los entrenamientos del día para tus atletas</p>
        </div>

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
              setEditingWod(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Crear WOD</span>
          </button>
        </div>

        {/* Lista de WODs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {wods.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {wods.map((wod) => {
                const esHoy = new Date().toISOString().split('T')[0] === wod.fechaString;
                return (
                  <div
                    key={wod.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${esHoy ? 'bg-red-50 border-l-4 border-avc-red' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {esHoy && (
                            <span className="bg-avc-red text-white px-3 py-1 rounded-full text-xs font-bold">
                              🔥 HOY
                            </span>
                          )}
                          <h3 className="text-2xl font-bold text-gray-900">{wod.titulo}</h3>
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(wod.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span className="bg-gray-700 text-white px-3 py-1 rounded text-xs font-semibold">
                            {wod.modalidad}
                          </span>
                          {wod.timeCap && (
                            <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded text-xs font-semibold">
                              ⏱️ {wod.timeCap} min
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 mb-3">
                          {wod.ejercicios?.map((ejercicio, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700">
                              <span className="font-semibold">•</span>
                              <span className="font-semibold">{ejercicio.nombre}</span>
                              <span>-</span>
                              <span>{ejercicio.cantidad}</span>
                              {ejercicio.peso && (
                                <>
                                  <span>@</span>
                                  <span className="font-semibold text-avc-red">{ejercicio.peso}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        {wod.notas && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <p className="text-sm text-gray-700">
                              <span className="font-bold">💡 Nota:</span> {wod.notas}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(wod)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(wod.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-gray-600 text-lg">No hay WODs creados</p>
              <p className="text-gray-500 text-sm mt-2">Haz click en "Crear WOD" para agregar tu primer entrenamiento del día</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingWod ? 'Editar WOD' : 'Nuevo WOD'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingWod(null);
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título del WOD</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: FRAN, MURPH, etc."
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad</label>
                  <select
                    value={formData.modalidad}
                    onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    {MODALIDADES.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Cap (minutos) <span className="text-gray-500 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.timeCap}
                    onChange={(e) => setFormData({ ...formData, timeCap: e.target.value })}
                    placeholder="Ej: 15"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Ejercicios</label>
                  <button
                    type="button"
                    onClick={addEjercicio}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded transition duration-300"
                  >
                    + Agregar Ejercicio
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.ejercicios.map((ejercicio, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={ejercicio.nombre}
                            onChange={(e) => updateEjercicio(index, 'nombre', e.target.value)}
                            placeholder="Nombre del ejercicio"
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            value={ejercicio.cantidad}
                            onChange={(e) => updateEjercicio(index, 'cantidad', e.target.value)}
                            placeholder="Cantidad (21-15-9)"
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            value={ejercicio.peso}
                            onChange={(e) => updateEjercicio(index, 'peso', e.target.value)}
                            placeholder="Peso (95/65 lb)"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                          />
                        </div>
                        <div className="col-span-1 flex items-center">
                          {formData.ejercicios.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEjercicio(index)}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas / Scaling <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Ej: Escalar pull-ups con banda, principiantes usar peso corporal..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingWod(null);
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
                  {editingWod ? 'Actualizar' : 'Crear'} WOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
