'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Paleta de colores disponibles para asignar a las clases
const PALETA_COLORES = [
  { bg: 'bg-red-600', border: 'border-red-600' },
  { bg: 'bg-blue-600', border: 'border-blue-600' },
  { bg: 'bg-orange-600', border: 'border-orange-600' },
  { bg: 'bg-purple-600', border: 'border-purple-600' },
  { bg: 'bg-pink-600', border: 'border-pink-600' },
  { bg: 'bg-green-600', border: 'border-green-600' },
  { bg: 'bg-yellow-600', border: 'border-yellow-600' },
  { bg: 'bg-indigo-600', border: 'border-indigo-600' },
  { bg: 'bg-cyan-600', border: 'border-cyan-600' },
  { bg: 'bg-fuchsia-600', border: 'border-fuchsia-600' },
  { bg: 'bg-emerald-600', border: 'border-emerald-600' },
  { bg: 'bg-rose-600', border: 'border-rose-600' },
  { bg: 'bg-amber-600', border: 'border-amber-600' },
  { bg: 'bg-lime-600', border: 'border-lime-600' },
  { bg: 'bg-teal-600', border: 'border-teal-600' },
  { bg: 'bg-violet-600', border: 'border-violet-600' },
  { bg: 'bg-sky-600', border: 'border-sky-600' },
  { bg: 'bg-slate-700', border: 'border-slate-700' },
];

// Función para generar un hash simple a partir del nombre de la clase
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Función para asignar un color único a cada clase basado en su nombre
const getClaseColor = (nombreClase, todasLasClases = []) => {
  const clasesOrdenadas = [...todasLasClases].sort();
  const indiceClase = clasesOrdenadas.indexOf(nombreClase);
  
  if (indiceClase === -1) {
    const colorIndex = hashString(nombreClase) % PALETA_COLORES.length;
    return PALETA_COLORES[colorIndex];
  }
  
  return PALETA_COLORES[indiceClase % PALETA_COLORES.length];
};

export default function HorariosPage() {
  // Obtener el día actual
  const getDayName = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date().getDay();
    return days[today];
  };

  const [selectedDay, setSelectedDay] = useState(getDayName());
  const [planes, setPlanes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const pricingRef = useScrollAnimation({ stagger: 0.15 });

  useEffect(() => {
    loadPlanes();
    loadHorarios();
    loadClases();
  }, []);

  const loadPlanes = async () => {
    try {
      const planesCol = collection(db, 'planes');
      const planesSnapshot = await getDocs(planesCol);
      const planesList = planesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      planesList.sort((a, b) => (a.order || 0) - (b.order || 0));
      setPlanes(planesList);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    } finally {
      setLoading(false);
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

  const loadHorarios = async () => {
    try {
      const horariosCol = collection(db, 'calendario');
      const horariosSnapshot = await getDocs(horariosCol);
      const horariosList = horariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate ? doc.data().fecha.toDate() : new Date(doc.data().fecha),
      }));
      setHorarios(horariosList);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  // Agrupar horarios por día de la semana
  const getScheduleByDay = () => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const scheduleByDay = {};

    // Inicializar todos los días
    dayNames.forEach(day => {
      scheduleByDay[day] = [];
    });

    // Filtrar solo horarios futuros o de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    horarios.forEach(horario => {
      const fecha = horario.fecha instanceof Date ? horario.fecha : new Date(horario.fecha);
      if (fecha >= today) {
        const dayName = dayNames[fecha.getDay()];
        scheduleByDay[dayName].push({
          time: horario.horaInicio,
          class: horario.clase,
          coach: horario.instructor,
          horaFin: horario.horaFin,
          nivel: horario.nivel,
          capacidad: horario.capacidadMaxima,
          fecha: fecha,
          type: horario.clase.toLowerCase().includes('crossfit') ? 'crossfit' 
                : horario.clase.toLowerCase().includes('funcional') ? 'funcional' 
                : horario.clase.toLowerCase().includes('yoga') ? 'yoga'
                : 'other'
        });
      }
    });

    // Ordenar horarios de cada día por hora
    Object.keys(scheduleByDay).forEach(day => {
      scheduleByDay[day].sort((a, b) => a.time.localeCompare(b.time));
    });

    return scheduleByDay;
  };

  const schedule = getScheduleByDay();

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Obtener lista de nombres de clases para el sistema de colores
  const nombresClases = clases.map(c => c.name);

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/444444/555555?text=Horarios+y+Planes+AVC"
            alt="Horarios AVC"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Horarios y <span className="text-avc-red">Membresías</span>
          </h1>
          <p className="text-xl text-gray-200">
            Elige el plan perfecto para ti y descubre nuestros horarios de clases.
          </p>
        </div>
      </section>

      {/* HORARIOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestros <span className="text-avc-red">Horarios</span>
            </h2>
            <p className="text-lg text-gray-700">
              Selecciona un día para ver las clases disponibles.
            </p>
          </div>

          {/* Selector de Días */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
                  selectedDay === day
                    ? 'bg-avc-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Clases del Día Seleccionado */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedDay}</h3>
            {schedule[selectedDay] && schedule[selectedDay].length > 0 ? (
              <div className="space-y-4">
                {schedule[selectedDay].map((entry, index) => {
                  const colores = getClaseColor(entry.class, nombresClases);
                  return (
                    <div
                      key={index}
                      className={`bg-gray-100 border-l-4 ${colores.border} rounded-lg p-6 hover:shadow-lg transition duration-300`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-2xl font-bold text-gray-900">{entry.time}</p>
                            {entry.horaFin && (
                              <span className="text-gray-500">- {entry.horaFin}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`${colores.bg} text-white px-3 py-1 rounded-lg text-lg font-semibold`}>
                              {entry.class}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Coach: {entry.coach}
                            </span>
                            {entry.nivel && (
                              <span className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                                {entry.nivel}
                              </span>
                            )}
                            {entry.capacidad && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {entry.capacidad} personas
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <Link
                            href="/unete"
                            className="bg-avc-red hover:bg-avc-red-dark text-white font-semibold py-3 px-6 rounded-full transition duration-300 inline-block"
                          >
                            Reservar
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-xl text-gray-700 mb-2">No hay clases programadas para {selectedDay}</p>
                <p className="text-gray-500">Selecciona otro día o contáctanos para más información</p>
              </div>
            )}
          </div>

          {/* Leyenda de colores */}
          {clases.length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Leyenda de Colores</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {clases.map((clase) => {
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
          )}
        </div>
      </section>

      {/* ZONA DE PROGRAMACIÓN */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Zona de <span className="text-avc-red">Programación</span>
              </h2>
              <p className="text-lg text-gray-700">
                Un espacio exclusivo diseñado para que trabajes de forma más enfocada en tus objetivos específicos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl border border-gray-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💪 ¿Para quién es?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Personas con programaciones externas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Atletas que siguen programas con nuestros coaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">✓</span>
                    <span>Quienes buscan un enfoque competitivo</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Beneficios</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Mejora tu técnica en movimientos específicos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Entrenamiento enfocado en fuerza</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Sigue tu programación personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-avc-red mr-2">•</span>
                    <span>Preparación para competencias</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border-2 border-avc-red">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Acceso a la Zona</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-avc-red text-4xl mb-2">✓</div>
                  <h4 className="text-gray-900 font-semibold mb-2">Incluido en membresías</h4>
                  <p className="text-gray-700 text-sm">CrossFit y Funcional incluyen acceso a la Zona de Programación</p>
                </div>
                <div className="text-center">
                  <div className="text-avc-red text-4xl mb-2">🏆</div>
                  <h4 className="text-gray-900 font-semibold mb-2">Paquete AVC Competición</h4>
                  <p className="text-gray-700 text-sm">Acceso exclusivo a la Zona (sin clases grupales)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBRESÍAS */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-avc-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Header con estadísticas */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-avc-red to-red-600 text-white rounded-full px-8 py-3 mb-6 shadow-lg shadow-avc-red/30 animate-pulse">
              <span className="font-bold text-sm uppercase tracking-wide">
                ✨ Planes Premium - Únete Hoy
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Transforma Tu Vida
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-avc-red via-red-600 to-red-700">
                Alcanza Tus Metas
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Elige el plan perfecto para ti. <span className="font-bold text-avc-red">Sin permanencia.</span> Sin letra pequeña. <span className="font-bold text-avc-red">Sin sorpresas.</span>
            </p>
            {/* Estadísticas mejoradas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-red-200">
                <div className="text-5xl font-black bg-gradient-to-r from-avc-red to-red-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-gray-800 font-semibold text-sm">Miembros Activos</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200">
                <div className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-gray-800 font-semibold text-sm">Clases Semanales</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-200">
                <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">4.9</div>
                <div className="text-gray-800 font-semibold text-sm">⭐ Rating</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200">
                <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-800 font-semibold text-sm">Acceso App</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando planes...</p>
            </div>
          ) : (
            <div
              ref={pricingRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {planes.map((plan, index) => (
                <div
                  key={plan.id}
                  data-animate
                  className={`relative group ${
                    plan.popular
                      ? 'md:scale-105 z-10'
                      : ''
                  }`}
                >
                  {/* Glow effect mejorado */}
                  {plan.popular && (
                    <div className="absolute -inset-1 bg-linear-to-r from-avc-red via-red-500 to-avc-red rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  )}
                  <div className={`relative rounded-3xl p-8 h-full flex flex-col overflow-hidden ${
                    plan.popular
                      ? 'bg-gradient-to-br from-white via-red-50 to-white border-3 border-avc-red shadow-2xl shadow-avc-red/30'
                      : 'bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 hover:border-avc-red/50 shadow-lg'
                  } transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
                    {/* Badge Popular mejorado */}
                    {plan.popular && (
                      <>
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-linear-to-r from-yellow-400 via-red-500 to-avc-red text-white px-8 py-2.5 rounded-full text-sm font-black shadow-2xl animate-bounce border-2 border-white">
                            MÁS POPULAR
                          </div>
                        </div>
                        {/* Ribbon decorativo */}
                        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                          <div className="absolute transform rotate-45 bg-linear-to-r from-avc-red to-red-700 text-white text-xs font-bold py-1 right-[-35px] top-[18px] w-[170px] text-center shadow-lg">
                            AHORRA
                          </div>
                        </div>
                      </>
                    )}
                    {/* Icon con fondo */}
                    <div className={`text-7xl mb-4 text-center ${plan.popular ? 'animate-pulse' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl ${plan.popular ? 'bg-linear-to-br from-red-100 to-red-200' : 'bg-linear-to-br from-gray-100 to-gray-200'}`}>
                        {plan.icon}
                      </div>
                    </div>
                    {/* Plan Name mejorado */}
                    <h3 className={`text-4xl font-black mb-3 text-center ${plan.popular ? 'text-transparent bg-clip-text bg-linear-to-r from-avc-red via-red-600 to-red-700' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    {/* Description */}
                    <p className="text-gray-700 text-center mb-6 text-sm font-medium">{plan.description}</p>
                    {/* Price mejorado */}
                    <div className="text-center mb-8 relative">
                      <div className={`inline-block px-6 py-4 rounded-2xl ${plan.popular ? 'bg-linear-to-br from-red-50 to-red-100 border-2 border-red-200' : 'bg-linear-to-br from-gray-50 to-gray-100'}`}>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className={`text-2xl font-bold ${plan.popular ? 'text-avc-red' : 'text-gray-600'}`}>$</span>
                          <span className={`text-7xl font-black ${plan.popular ? 'text-transparent bg-clip-text bg-linear-to-r from-avc-red to-red-600' : 'text-gray-900'}`}>
                            {plan.price}
                          </span>
                        </div>
                        <span className="text-gray-700 text-lg font-semibold">{plan.period}</span>
                      </div>
                    </div>
                    {/* Features mejorado */}
                    <div className="mb-6 grow">
                      <div className={`rounded-2xl p-5 mb-4 ${plan.popular ? 'bg-white border-2 border-red-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
                        <h4 className="text-gray-900 font-bold mb-4 flex items-center text-base">
                          <svg className={`w-6 h-6 mr-2 ${plan.popular ? 'text-avc-red' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Incluye:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features?.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <svg
                                className={`w-5 h-5 mr-2 shrink-0 mt-0.5 ${plan.popular ? 'text-green-600' : 'text-green-500'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-gray-800 font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Benefits mejorado */}
                      {plan.benefits && plan.benefits.length > 0 && (
                        <div className={`rounded-2xl p-4 ${plan.popular ? 'bg-linear-to-br from-red-50 to-red-100 border border-red-200' : 'bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
                          <h4 className="text-gray-900 font-bold mb-3 text-sm flex items-center">
                            <svg className={`w-5 h-5 mr-2 ${plan.popular ? 'text-avc-red' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Beneficios Extra:
                          </h4>
                          <ul className="space-y-2">
                            {plan.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-gray-700 text-xs flex items-start font-medium">
                                <span className={`mr-2 ${plan.popular ? 'text-avc-red' : 'text-gray-600'}`}>✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* CTA Button mejorado */}
                    <Link
                      href="/unete"
                      className={`block text-center font-black py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl text-lg ${
                        plan.popular
                          ? 'bg-linear-to-r from-avc-red via-red-600 to-red-700 hover:from-red-700 hover:to-avc-red text-white shadow-avc-red/50 animate-pulse'
                          : 'bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-gray-400/50'
                      }`}
                    >
                      {plan.popular ? '🔥 Comenzar Ahora' : 'Elegir Plan'}
                    </Link>
                    {/* Garantía */}
                    {plan.popular && (
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                          ✓ Garantía de satisfacción 30 días
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Trust Section mejorada */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-linear-to-br from-white via-gray-50 to-white rounded-3xl p-10 border-2 border-gray-200 shadow-2xl">
              <h3 className="text-3xl font-black text-center text-gray-900 mb-8">
                ¿Por qué <span className="text-transparent bg-clip-text bg-linear-to-r from-avc-red to-red-600">AVC Fitness?</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl mb-4 inline-block p-4 bg-linear-to-br from-green-100 to-green-200 rounded-2xl group-hover:animate-bounce">
                    🎯
                  </div>
                  <h4 className="text-gray-900 font-black mb-3 text-lg">Sin Permanencia</h4>
                  <p className="text-gray-700 text-sm font-medium">Cancela cuando quieras, <span className="text-avc-red font-bold">sin penalizaciones</span></p>
                </div>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl mb-4 inline-block p-4 bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:animate-bounce">
                    💳
                  </div>
                  <h4 className="text-gray-900 font-black mb-3 text-lg">Pago Flexible</h4>
                  <p className="text-gray-700 text-sm font-medium">Efectivo, tarjeta o <span className="text-avc-red font-bold">transferencia</span></p>
                </div>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl mb-4 inline-block p-4 bg-linear-to-br from-purple-100 to-purple-200 rounded-2xl group-hover:animate-bounce">
                    🎁
                  </div>
                  <h4 className="text-gray-900 font-black mb-3 text-lg">Clase Gratis</h4>
                  <p className="text-gray-700 text-sm font-medium">Prueba <span className="text-avc-red font-bold">antes</span> de comprometerte</p>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Final mejorado */}
          <div className="text-center mt-16 relative">
            {/* Fondo decorativo para CTA */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-96 h-96 bg-avc-red rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-bold text-gray-900 mb-3">¿Listo para el cambio?</p>
              <p className="text-gray-700 mb-8 text-lg">¿Necesitas ayuda para elegir? <span className="text-avc-red font-bold">¡Estamos aquí!</span></p>
              <Link
                href="/unete"
                className="inline-flex items-center space-x-3 bg-linear-to-r from-avc-red via-red-600 to-red-700 hover:from-red-700 hover:to-avc-red text-white font-black py-6 px-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-avc-red/50 text-xl border-4 border-white animate-pulse"
              >
                <span>🔥 Agenda tu Clase Gratuita</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-xs text-gray-600 mt-4 font-semibold">✓ Sin compromiso  •  ✓ Sin tarjeta  •  ✓ Reserva en 30 segundos</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
