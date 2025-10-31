'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function EventosPage() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      const eventosCol = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosCol);
      const eventosList = eventosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const upcomingEvents = eventosList.filter((e) => new Date(e.date) >= now);
      const pastEvents = eventosList.filter((e) => new Date(e.date) < now);

      // Ordenar por fecha
      upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

      setUpcoming(upcomingEvents);
      setPast(pastEvents);
    } catch (error) {
      console.error('Error fetching eventos:', error);
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const displayUpcoming = upcoming;
  const displayPast = past;

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/dc2626/333333?text=Eventos+AVC"
            alt="Eventos"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Eventos <span className="text-avc-red">AVC</span>
          </h1>
          <p className="text-xl text-gray-200">
            Competencias, workshops y actividades especiales para toda la comunidad
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">
            Próximos <span className="text-avc-red">Eventos</span>
          </h2>
          
          {displayUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {displayUpcoming.map((event) => (
                <div
                  key={event.id}
                  onClick={() => openModal(event)}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-avc-red group cursor-pointer"
                >
                  <div className="relative h-64">
                    <Image
                      src={event.image || 'https://placehold.co/800x400/dc2626/333333?text=Evento+AVC'}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-avc-red text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-avc-red font-semibold mb-3">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                    
                    <p className="text-gray-400 mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      
                      {event.capacity && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Capacidad: {event.capacity} personas
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(event);
                        }}
                        className="inline-flex items-center justify-center w-full bg-avc-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                      >
                        <span>Ver Detalles</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center mb-20">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">No hay eventos próximos en este momento</p>
              <p className="text-gray-500 text-sm mt-2">¡Mantente atento a nuestras redes sociales!</p>
            </div>
          )}

          <h2 className="text-3xl font-bold text-white mb-12">
            Eventos <span className="text-avc-red">Pasados</span>
          </h2>
          
          {displayPast.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayPast.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => openModal(event)}
                  className="bg-gray-800 rounded-xl overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300 border border-gray-700 cursor-pointer"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.image || 'https://placehold.co/800x400/333333/white?text=Evento'}
                      alt={event.title}
                      fill
                      className="object-cover grayscale"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('es-MX')}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
              <p className="text-gray-400 text-lg">No hay eventos pasados registrados</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalles del Evento */}
      {showModal && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal con Imagen */}
            <div className="relative h-80">
              <Image
                src={selectedEvent.image || 'https://placehold.co/1200x600/dc2626/333333?text=Evento+AVC'}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent"></div>
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-avc-red text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                    {selectedEvent.category}
                  </span>
                  {new Date(selectedEvent.date) >= new Date() && (
                    <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold animate-pulse">
                      Próximamente
                    </span>
                  )}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">{selectedEvent.title}</h2>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8">
              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-avc-red bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-avc-red" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Fecha</p>
                      <p className="text-white font-semibold text-lg">
                        {new Date(selectedEvent.date).toLocaleDateString('es-MX', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-avc-red bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-avc-red" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Hora</p>
                      <p className="text-white font-semibold text-lg">{selectedEvent.time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-avc-red bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-avc-red" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ubicación</p>
                      <p className="text-white font-semibold text-lg">{selectedEvent.location}</p>
                    </div>
                  </div>

                  {selectedEvent.capacity && (
                    <div className="flex items-start space-x-3">
                      <div className="bg-avc-red bg-opacity-20 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-avc-red" fill="none" stroke="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Capacidad</p>
                        <p className="text-white font-semibold text-lg">{selectedEvent.capacity} personas</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Descripción del Evento</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedEvent.registrationLink && (
                  <a
                    href={selectedEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center bg-avc-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 text-lg group"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Registrarse Ahora</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}
                
                <button
                  onClick={closeModal}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-300"
                >
                  Cerrar
                </button>
              </div>

              {/* Nota si no hay link de registro */}
              {!selectedEvent.registrationLink && (
                <div className="mt-6 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4">
                  <p className="text-yellow-500 text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Para más información sobre este evento, contáctanos directamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
