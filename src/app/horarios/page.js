'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  const [loading, setLoading] = useState(true);
  const pricingRef = useScrollAnimation({ stagger: 0.15 });

  useEffect(() => {
    loadPlanes();
    loadHorarios();
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

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
                {schedule[selectedDay].map((entry, index) => (
                  <div
                    key={index}
                    className={`bg-gray-100 border-l-4 rounded-lg p-6 hover:bg-gray-750 transition duration-300 ${
                      entry.type === 'crossfit'
                        ? 'border-avc-red'
                        : entry.type === 'funcional'
                        ? 'border-yellow-500'
                        : entry.type === 'yoga'
                        ? 'border-purple-500'
                        : 'border-blue-500'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-2xl font-bold text-gray-900">{entry.time}</p>
                          {entry.horaFin && (
                            <span className="text-gray-500">- {entry.horaFin}</span>
                          )}
                        </div>
                        <p className="text-xl text-gray-700 mt-1 font-semibold">{entry.class}</p>
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
                          className="bg-avc-red hover:bg-avc-red-dark text-gray-900 font-semibold py-3 px-6 rounded-full transition duration-300 inline-block"
                        >
                          Reservar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-xl text-gray-700 mb-2">No hay clases programadas para {selectedDay}</p>
                <p className="text-gray-500">Selecciona otro día o contáctanos para más información</p>
              </div>
            )}
          </div>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Header con estadísticas */}
          <div className="text-center mb-16">
            <div className="inline-block bg-avc-red/10 border border-avc-red/30 rounded-full px-6 py-2 mb-6">
              <span className="text-avc-red font-semibold text-sm uppercase tracking-wide">
                ✨ Planes Premium
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Invierte en tu <span className="text-avc-red">Mejor Versión</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Elige el plan perfecto para alcanzar tus metas. Sin letra pequeña, sin sorpresas.
            </p>
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-avc-red mb-2">500+</div>
                <div className="text-gray-600 text-sm">Miembros Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-avc-red mb-2">50+</div>
                <div className="text-gray-600 text-sm">Clases Semanales</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-avc-red mb-2">4.9</div>
                <div className="text-gray-600 text-sm">⭐ Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-avc-red mb-2">24/7</div>
                <div className="text-gray-600 text-sm">Acceso App</div>
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
                  {/* Glow effect */}
                  {plan.popular && (
                    <div className="absolute -inset-1 bg-linear-to-r from-avc-red via-red-500 to-avc-red rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                  )}
                  <div className={`relative bg-white rounded-2xl p-8 h-full flex flex-col ${
                    plan.popular
                      ? 'border-2 border-avc-red shadow-2xl shadow-avc-red/20'
                      : 'border border-gray-300 hover:border-gray-400'
                  } transition-all duration-300 hover:shadow-2xl`}>
                    {/* Badge Popular */}
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-linear-to-r from-avc-red to-red-600 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          ⭐ MÁS POPULAR
                        </div>
                      </div>
                    )}
                    {/* Icon */}
                    <div className="text-6xl mb-4 text-center">{plan.icon}</div>
                    {/* Plan Name */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center">{plan.name}</h3>
                    {/* Description */}
                    <p className="text-gray-600 text-center mb-6 text-sm">{plan.description}</p>
                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-gray-600 text-lg">$</span>
                        <span className="text-6xl font-extrabold text-gray-900">{plan.price}</span>
                      </div>
                      <span className="text-gray-600 text-lg">{plan.period}</span>
                    </div>
                    {/* Features */}
                    <div className="mb-6 grow">
                      <div className="bg-gray-100 rounded-xl p-5 mb-4">
                        <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                          <svg className="w-5 h-5 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Incluye:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features?.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <svg
                                className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Benefits */}
                      {plan.benefits && plan.benefits.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-gray-900 font-semibold mb-2 text-sm flex items-center">
                            <svg className="w-4 h-4 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Beneficios:
                          </h4>
                          <ul className="space-y-1">
                            {plan.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-gray-600 text-xs flex items-start">
                                <span className="text-avc-red mr-1">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* CTA Button */}
                    <Link
                      href="/unete"
                      className={`block text-center font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-linear-to-r from-avc-red to-red-600 hover:from-red-600 hover:to-avc-red text-gray-900 shadow-lg shadow-avc-red/50'
                          : 'bg-linear-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900'
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
          {/* Trust Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-300">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-gray-900 font-semibold mb-2">Sin Permanencia</h4>
                  <p className="text-gray-600 text-sm">Cancela cuando quieras, sin penalizaciones</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💳</div>
                  <h4 className="text-gray-900 font-semibold mb-2">Pago Flexible</h4>
                  <p className="text-gray-600 text-sm">Efectivo, tarjeta o transferencia</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🎁</div>
                  <h4 className="text-gray-900 font-semibold mb-2">Clase Gratis</h4>
                  <p className="text-gray-600 text-sm">Prueba antes de comprometerte</p>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Final */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">¿Necesitas ayuda para elegir?</p>
            <Link
              href="/unete"
              className="inline-flex items-center space-x-2 bg-linear-to-r from-avc-red to-red-600 hover:from-red-600 hover:to-avc-red text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-avc-red/50"
            >
              <span>Agenda tu Clase Gratuita</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
