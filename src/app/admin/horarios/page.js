'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import AdminHeader from '../components/AdminHeader';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Paleta de colores disponibles para asignar a las clases
const PALETA_COLORES = [
  { bg: 'bg-red-600', bgOpacity: 'bg-red-600 bg-opacity-20', border: 'border-red-600', text: 'text-white' },
  { bg: 'bg-blue-600', bgOpacity: 'bg-blue-600 bg-opacity-20', border: 'border-blue-600', text: 'text-white' },
  { bg: 'bg-orange-600', bgOpacity: 'bg-orange-600 bg-opacity-20', border: 'border-orange-600', text: 'text-white' },
  { bg: 'bg-purple-600', bgOpacity: 'bg-purple-600 bg-opacity-20', border: 'border-purple-600', text: 'text-white' },
  { bg: 'bg-pink-600', bgOpacity: 'bg-pink-600 bg-opacity-20', border: 'border-pink-600', text: 'text-white' },
  { bg: 'bg-green-600', bgOpacity: 'bg-green-600 bg-opacity-20', border: 'border-green-600', text: 'text-white' },
  { bg: 'bg-yellow-600', bgOpacity: 'bg-yellow-600 bg-opacity-20', border: 'border-yellow-600', text: 'text-white' },
  { bg: 'bg-indigo-600', bgOpacity: 'bg-indigo-600 bg-opacity-20', border: 'border-indigo-600', text: 'text-white' },
  { bg: 'bg-cyan-600', bgOpacity: 'bg-cyan-600 bg-opacity-20', border: 'border-cyan-600', text: 'text-white' },
  { bg: 'bg-fuchsia-600', bgOpacity: 'bg-fuchsia-600 bg-opacity-20', border: 'border-fuchsia-600', text: 'text-white' },
  { bg: 'bg-emerald-600', bgOpacity: 'bg-emerald-600 bg-opacity-20', border: 'border-emerald-600', text: 'text-white' },
  { bg: 'bg-rose-600', bgOpacity: 'bg-rose-600 bg-opacity-20', border: 'border-rose-600', text: 'text-white' },
  { bg: 'bg-amber-600', bgOpacity: 'bg-amber-600 bg-opacity-20', border: 'border-amber-600', text: 'text-white' },
  { bg: 'bg-lime-600', bgOpacity: 'bg-lime-600 bg-opacity-20', border: 'border-lime-600', text: 'text-white' },
  { bg: 'bg-teal-600', bgOpacity: 'bg-teal-600 bg-opacity-20', border: 'border-teal-600', text: 'text-white' },
  { bg: 'bg-violet-600', bgOpacity: 'bg-violet-600 bg-opacity-20', border: 'border-violet-600', text: 'text-white' },
  { bg: 'bg-sky-600', bgOpacity: 'bg-sky-600 bg-opacity-20', border: 'border-sky-600', text: 'text-white' },
  { bg: 'bg-slate-700', bgOpacity: 'bg-slate-700 bg-opacity-20', border: 'border-slate-700', text: 'text-white' },
];

// Función para generar un hash simple a partir del nombre de la clase
const hashString = (str) => {
  if (!str || typeof str !== 'string') return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Función para asignar un color único a cada clase basado en su nombre
const getClaseColor = (nombreClase, todasLasClases = []) => {
  // Manejar casos donde nombreClase es undefined o null
  if (!nombreClase) {
    return PALETA_COLORES[0]; // Color por defecto
  }
  
  // Crear un array ordenado de nombres de clases para asegurar consistencia
  const clasesOrdenadas = [...todasLasClases].sort();
  const indiceClase = clasesOrdenadas.indexOf(nombreClase);
  
  if (indiceClase === -1) {
    // Si la clase no está en la lista, usar hash para asignar un color
    const colorIndex = hashString(nombreClase) % PALETA_COLORES.length;
    return PALETA_COLORES[colorIndex];
  }
  
  // Asignar color basado en el índice para evitar repeticiones
  return PALETA_COLORES[indiceClase % PALETA_COLORES.length];
};

export default function AdminHorariosPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReservacionesModal, setShowReservacionesModal] = useState(false);
  const [reservaciones, setReservaciones] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [loadingReservaciones, setLoadingReservaciones] = useState(false);
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
      const calendarioCol = collection(db, 'calendario');
      const horariosSnapshot = await getDocs(calendarioCol);
      
      // Cargar horarios con conteo de reservaciones
      const horariosListPromises = horariosSnapshot.docs
        .map(async (docHorario) => {
          const horarioData = docHorario.data();
          
          // Si no es una clase regular, saltar
          if (horarioData.tipo === 'wod' || !horarioData.clase) {
            return null;
          }
          
          // Contar reservaciones confirmadas
          let reservacionesCount = 0;
          try {
            const reservacionesCol = collection(db, 'calendario', docHorario.id, 'reservaciones');
            const reservacionesSnapshot = await getDocs(reservacionesCol);
            reservacionesCount = reservacionesSnapshot.docs.filter(doc => {
              const status = doc.data().status;
              return status === 'confirmada';
            }).length;
          } catch (error) {
            console.error('Error al contar reservaciones:', error);
          }
          
          return {
            id: docHorario.id,
            ...horarioData,
            fecha: horarioData.fecha?.toDate ? horarioData.fecha.toDate() : new Date(horarioData.fecha),
            reservacionesCount
          };
        });
      
      const horariosListWithNulls = await Promise.all(horariosListPromises);
      const horariosList = horariosListWithNulls.filter(h => h !== null);
      
      // Ordenar por fecha y hora
      horariosList.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        if (fechaA.getTime() !== fechaB.getTime()) {
          return fechaA - fechaB;
        }
        return a.horaInicio?.localeCompare(b.horaInicio || '') || 0;
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

  const loadReservaciones = async (horarioId) => {
    setLoadingReservaciones(true);
    try {
      const reservacionesCol = collection(db, 'calendario', horarioId, 'reservaciones');
      const reservacionesSnapshot = await getDocs(reservacionesCol);
      
      // Cargar info de usuarios para cada reservación
      const reservacionesConUsuarios = await Promise.all(
        reservacionesSnapshot.docs.map(async (docReserva) => {
          const reservaData = docReserva.data();
          
          // Intentar cargar info del usuario
          let userData = null;
          if (reservaData.odIdUsuarioId) {
            try {
              const userDocRef = doc(db, 'users', reservaData.odIdUsuarioId);
              const userDoc = await getDocs(collection(db, 'users'));
              const userSnapshot = userDoc.docs.find(d => d.id === reservaData.odIdUsuarioId);
              if (userSnapshot) {
                userData = userSnapshot.data();
              }
            } catch (error) {
              console.error('Error al cargar usuario:', error);
            }
          }
          
          return {
            id: docReserva.id,
            ...reservaData,
            createdAt: reservaData.createdAt?.toDate ? reservaData.createdAt.toDate() : new Date(reservaData.createdAt),
            usuario: userData
          };
        })
      );
      
      // Ordenar por fecha de creación
      reservacionesConUsuarios.sort((a, b) => b.createdAt - a.createdAt);
      setReservaciones(reservacionesConUsuarios);
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
      setReservaciones([]);
    } finally {
      setLoadingReservaciones(false);
    }
  };

  const handleVerReservaciones = async (horario) => {
    setClaseSeleccionada(horario);
    setShowReservacionesModal(true);
    await loadReservaciones(horario.id);
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
          reservacionesCount: 0,
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

  // Calcular duración en minutos basada en hora inicio y fin
  const calcularDuracion = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return 60;
    
    const [horasInicio, minutosInicio] = horaInicio.split(':').map(Number);
    const [horasFin, minutosFin] = horaFin.split(':').map(Number);
    
    const totalMinutosInicio = horasInicio * 60 + minutosInicio;
    const totalMinutosFin = horasFin * 60 + minutosFin;
    
    let duracion = totalMinutosFin - totalMinutosInicio;
    
    // Si la hora fin es menor que la inicio, asumimos que cruza medianoche
    if (duracion < 0) {
      duracion = (24 * 60) + duracion;
    }
    
    return duracion > 0 ? duracion : 60;
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
    const duracion = calcularDuracion(horaInicio, horaFin);
    setFormData({ ...formData, horaInicio, horaFin, duracion });
  };

  // Actualizar hora fin y recalcular duración
  const handleHoraFinChange = (horaFin) => {
    const duracion = calcularDuracion(formData.horaInicio, horaFin);
    setFormData({ ...formData, horaFin, duracion });
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
                          {horariosDelDia.slice(0, 5).map((horario) => {
                            const nombresClases = clases.map(c => c.name);
                            const colores = getClaseColor(horario.clase, nombresClases);
                            return (
                              <div
                                key={horario.id}
                                className={`${colores.bg} border ${colores.border} rounded p-1 text-xs cursor-pointer hover:opacity-90 transition-opacity`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(horario);
                                }}
                              >
                                <div className="text-white font-semibold truncate px-1">
                                  {horario.clase}
                                </div>
                                <div className="text-white opacity-90 mt-0.5 px-1">{horario.horaInicio}</div>
                              </div>
                            );
                          })}
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
                  const nombresClases = clases.map(c => c.name);
                  const colores = getClaseColor(horario.clase, nombresClases);
                  return (
                    <div
                      key={horario.id}
                      className={`bg-gray-100 rounded-lg p-4 border-2 ${colores.border} hover:shadow-lg transition-all duration-300 flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className={`${colores.bg} ${colores.text} px-3 py-1 rounded text-sm font-semibold`}>
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
                          <span className="bg-gray-700 px-2 py-1 rounded text-xs text-white">{horario.nivel}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleVerReservaciones(horario)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Reservaciones ({horario.reservacionesCount || 0})</span>
                        </button>
                        <button
                          onClick={() => handleEdit(horario)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(horario.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
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

        {/* Leyenda de colores */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Leyenda de Colores</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {clases.map((clase) => {
              const nombresClases = clases.map(c => c.name);
              const colores = getClaseColor(clase.name, nombresClases);
              return (
                <div key={clase.id} className="flex items-center space-x-2">
                  <div className={`${colores.bg} w-4 h-4 rounded`}></div>
                  <span className="text-sm text-gray-700">{clase.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
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
                  <select
                    value={formData.horaInicio}
                    onChange={(e) => handleHoraInicioChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="">Selecciona hora</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hora = String(i).padStart(2, '0');
                      return (
                        <option key={hora} value={`${hora}:00`}>
                          {`${hora}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora Fin
                  </label>
                  <select
                    value={formData.horaFin}
                    onChange={(e) => handleHoraFinChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  >
                    <option value="">Selecciona hora</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hora = String(i).padStart(2, '0');
                      return (
                        <option key={hora} value={`${hora}:00`}>
                          {`${hora}:00`}
                        </option>
                      );
                    })}
                  </select>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duración</label>
                  <div className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-semibold">
                    {formData.duracion} minutos
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Calculada automáticamente</p>
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
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-avc-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  {editingHorario ? 'Actualizar' : 'Crear'} Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Reservaciones */}
      {showReservacionesModal && claseSeleccionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reservaciones</h2>
                <p className="text-gray-600 mt-1">
                  {claseSeleccionada.clase} - {new Date(claseSeleccionada.fecha).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} - {claseSeleccionada.horaInicio}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReservacionesModal(false);
                  setClaseSeleccionada(null);
                  setReservaciones([]);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {loadingReservaciones ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando reservaciones...</p>
                </div>
              ) : reservaciones.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-700">
                      <span className="font-bold text-lg">{reservaciones.length}</span> de <span className="font-bold">{claseSeleccionada.capacidadMaxima}</span> lugares ocupados
                    </p>
                    <div className="text-sm text-gray-600">
                      Disponibles: <span className="font-bold text-green-600">{claseSeleccionada.capacidadMaxima - reservaciones.length}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reservaciones.map((reserva, index) => (
                      <div
                        key={reserva.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="bg-avc-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </span>
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                  {reserva.nombreUsuario || reserva.usuario?.displayName || 'Sin nombre'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {reserva.emailUsuario || reserva.usuario?.email}
                                </p>
                              </div>
                            </div>

                            {reserva.usuario && (
                              <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {reserva.usuario.phone && (
                                  <div className="flex items-center text-sm text-gray-700">
                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {reserva.usuario.phone}
                                  </div>
                                )}
                                {reserva.usuario.level && (
                                  <div className="flex items-center">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                      {reserva.usuario.level}
                                    </span>
                                  </div>
                                )}
                                {reserva.usuario.membershipType && (
                                  <div className="flex items-center">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                                      {reserva.usuario.membershipType}
                                    </span>
                                  </div>
                                )}
                                {reserva.usuario.streak !== undefined && (
                                  <div className="flex items-center text-sm text-gray-700">
                                    <span className="mr-1">🔥</span>
                                    <span className="font-semibold">{reserva.usuario.streak}</span>
                                    <span className="ml-1 text-xs">racha</span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="ml-11 mt-2 text-xs text-gray-500">
                              Reservó: {reserva.createdAt.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reserva.status === 'confirmada'
                                ? 'bg-green-100 text-green-800'
                                : reserva.status === 'cancelada'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reserva.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 text-lg">No hay reservaciones para esta clase</p>
                  <p className="text-gray-500 text-sm mt-2">Las reservaciones aparecerán aquí cuando los usuarios se inscriban</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
