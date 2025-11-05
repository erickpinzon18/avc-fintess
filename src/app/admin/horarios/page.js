'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function AdminHorariosPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    clase: '',
    fecha: '',
    horaInicio: '07:00',
    horaFin: '08:00',
    instructor: '',
    capacidadMaxima: 20,
    nivel: 'Todos los niveles',
    duracion: 60,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadHorarios();
        loadClases();
        loadCoaches();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadHorarios = async () => {
    try {
      const horariosCol = collection(db, 'calendario');
      const horariosSnapshot = await getDocs(horariosCol);
      const horariosList = horariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate ? doc.data().fecha.toDate() : new Date(doc.data().fecha),
      }));
      // Ordenar por fecha y hora
      horariosList.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        if (fechaA.getTime() !== fechaB.getTime()) {
          return fechaA - fechaB;
        }
        return a.horaInicio.localeCompare(b.horaInicio);
      });
      setHorarios(horariosList);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

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
      // Crear fecha en zona horaria local para evitar problemas de offset UTC
      const [year, month, day] = formData.fecha.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);
      
      const dataToSave = {
        ...formData,
        fecha: fechaLocal,
        capacidadMaxima: parseInt(formData.capacidadMaxima),
        duracion: parseInt(formData.duracion),
      };

      if (editingHorario) {
        const horarioRef = doc(db, 'calendario', editingHorario.id);
        await updateDoc(horarioRef, dataToSave);
      } else {
        await addDoc(collection(db, 'calendario'), {
          ...dataToSave,
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingHorario(null);
      resetForm();
      loadHorarios();
    } catch (error) {
      console.error('Error al guardar horario:', error);
      alert('Error al guardar el horario');
    }
  };

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    const fecha = horario.fecha instanceof Date ? horario.fecha : new Date(horario.fecha);
    setFormData({
      clase: horario.clase || '',
      fecha: fecha.toISOString().split('T')[0],
      horaInicio: horario.horaInicio || '',
      horaFin: horario.horaFin || '',
      instructor: horario.instructor || '',
      capacidadMaxima: horario.capacidadMaxima || 20,
      nivel: horario.nivel || 'Todos los niveles',
      duracion: horario.duracion || 60,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este horario?')) {
      try {
        await deleteDoc(doc(db, 'calendario', id));
        loadHorarios();
      } catch (error) {
        console.error('Error al eliminar horario:', error);
        alert('Error al eliminar el horario');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clase: '',
      fecha: selectedDate || '',
      horaInicio: '07:00',
      horaFin: '08:00',
      instructor: '',
      capacidadMaxima: 20,
      nivel: 'Todos los niveles',
      duracion: 60,
    });
  };

  // Calcular hora fin automáticamente
  const calcularHoraFin = (horaInicio, duracion) => {
    if (!horaInicio || !duracion) return '';
    
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + parseInt(duracion);
    
    const nuevasHoras = Math.floor(totalMinutos / 60) % 24;
    const nuevosMinutos = totalMinutos % 60;
    
    return `${String(nuevasHoras).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
  };

  // Actualizar hora de inicio y recalcular hora fin
  const handleHoraInicioChange = (horaInicio) => {
    const horaFin = calcularHoraFin(horaInicio, formData.duracion);
    setFormData({ ...formData, horaInicio, horaFin });
  };

  // Actualizar duración y recalcular hora fin
  const handleDuracionChange = (duracion) => {
    const horaFin = calcularHoraFin(formData.horaInicio, duracion);
    setFormData({ ...formData, duracion, horaFin });
  };

  // Funciones para el calendario
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getHorariosForDate = (date) => {
    if (!date) return [];
    return horarios.filter(h => {
      const horarioDate = h.fecha instanceof Date ? h.fecha : new Date(h.fecha);
      return horarioDate.toDateString() === date.toDateString();
    });
  };

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (!date || isPast(date)) return;
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setFormData({ ...formData, fecha: dateStr });
    setShowModal(true);
  };

  // Agrupar horarios por día
  const horariosPorDia = DIAS_SEMANA.reduce((acc, dia) => {
    acc[dia] = horarios.filter((h) => h.dia === dia);
    return acc;
  }, {});

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
        title="Calendario de Clases"
        subtitle="Gestiona los horarios de todas las clases del mes"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar Horarios</h2>
          <p className="text-gray-600">Gestiona el calendario de clases, instructores y disponibilidad</p>
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
              setEditingHorario(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Horario</span>
          </button>
        </div>

        {/* Controles del calendario */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-gray-100 hover:bg-gray-50 text-gray-900 p-3 rounded-lg transition duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900">
              {MESES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="bg-gray-100 hover:bg-gray-50 text-gray-900 p-3 rounded-lg transition duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="text-center text-gray-600 font-semibold py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentMonth).map((date, index) => {
              const horariosDelDia = date ? getHorariosForDate(date) : [];
              const esHoy = isToday(date);
              const esPasado = isPast(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[200px] p-2 rounded-lg border-2 transition-all duration-300 ${
                    !date
                      ? 'bg-gray-50 border-gray-900'
                      : esPasado
                      ? 'bg-gray-100 border-gray-300 opacity-50'
                      : esHoy
                      ? 'bg-gray-100 border-avc-red'
                      : 'bg-gray-100 border-gray-300 hover:border-avc-red cursor-pointer'
                  }`}
                  onClick={() => date && !esPasado && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${esHoy ? 'text-avc-red' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </div>
                      
                      {horariosDelDia.length > 0 && (
                        <div className="space-y-1">
                          {horariosDelDia.slice(0, 5).map((horario) => (
                            <div
                              key={horario.id}
                              className="bg-avc-red bg-opacity-20 border border-avc-red rounded p-1 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(horario);
                              }}
                            >
                              <div className="text-gray-900 font-semibold truncate">{horario.clase}</div>
                              <div className="text-red-200">{horario.horaInicio}</div>
                            </div>
                          ))}
                          {horariosDelDia.length > 5 && (
                            <div className="text-xs text-gray-600 text-center">
                              +{horariosDelDia.length - 5} más
                            </div>
                          )}
                        </div>
                      )}
                      
                      {horariosDelDia.length === 0 && !esPasado && (
                        <div className="text-center text-gray-600 text-xs mt-2">
                          Click para agregar
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de próximas clases */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Próximas Clases Programadas</h3>
          
          {horarios.filter(h => !isPast(h.fecha instanceof Date ? h.fecha : new Date(h.fecha))).length > 0 ? (
            <div className="space-y-4">
              {horarios
                .filter(h => !isPast(h.fecha instanceof Date ? h.fecha : new Date(h.fecha)))
                .slice(0, 10)
                .map((horario) => {
                  const fecha = horario.fecha instanceof Date ? horario.fecha : new Date(horario.fecha);
                  return (
                    <div
                      key={horario.id}
                      className="bg-gray-100 rounded-lg p-4 border border-gray-300 hover:border-avc-red transition-all duration-300 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="bg-avc-red text-gray-900 px-3 py-1 rounded text-sm font-semibold">
                            {fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <h4 className="text-xl font-bold text-gray-900">{horario.clase}</h4>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-700">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {horario.horaInicio} - {horario.horaFin}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {horario.instructor}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {horario.capacidadMaxima} personas
                          </span>
                          <span className="bg-gray-700 px-2 py-1 rounded text-xs">{horario.nivel}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(horario)}
                          className="bg-blue-600 hover:bg-blue-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(horario.id)}
                          className="bg-red-600 hover:bg-red-700 text-gray-900 font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hay clases programadas próximamente</p>
              <p className="text-gray-500 text-sm mt-2">Haz click en una fecha del calendario para agregar una clase</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingHorario ? 'Editar Horario' : 'Nuevo Horario'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingHorario(null);
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Clase</label>
                <select
                  value={formData.clase}
                  onChange={(e) => setFormData({ ...formData, clase: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                >
                  <option value="">Selecciona una clase</option>
                  {clases.map((clase) => (
                    <option key={clase.id} value={clase.name}>
                      {clase.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Inicio</label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => handleHoraInicioChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora Fin <span className="text-gray-500 text-xs">(calculada automáticamente)</span>
                  </label>
                  <input
                    type="time"
                    value={formData.horaFin}
                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor</label>
                <select
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                >
                  <option value="">Selecciona un instructor</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.name}>
                      {coach.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duración (minutos)</label>
                  <input
                    type="number"
                    value={formData.duracion}
                    onChange={(e) => handleDuracionChange(e.target.value)}
                    required
                    min="15"
                    max="180"
                    step="15"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                  <p className="text-xs text-gray-500 mt-1">Incrementos de 15 minutos</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidad Máxima</label>
                  <input
                    type="number"
                    value={formData.capacidadMaxima}
                    onChange={(e) => setFormData({ ...formData, capacidadMaxima: e.target.value })}
                    required
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel</label>
                <select
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Todos los niveles">Todos los niveles</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingHorario(null);
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
                  {editingHorario ? 'Actualizar' : 'Crear'} Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
