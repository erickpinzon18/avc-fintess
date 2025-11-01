'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    loadCoaches();
  }, []);

  const openCoachModal = (coach) => {
    setSelectedCoach(coach);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoach(null);
  };
  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Nuestros+Coaches"
            alt="Coaches de AVC Fitness"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Conoce a nuestros <span className="text-avc-red">Coaches</span>
          </h1>
          <p className="text-xl text-gray-200">
            Profesionales apasionados dedicados a tu éxito y bienestar.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestro <span className="text-avc-red">Equipo</span>
            </h2>
            <p className="text-lg text-gray-700">
              Cada coach de AVC está certificado, capacitado y, lo más importante, comprometido
              con ayudarte a alcanzar tus objetivos de forma segura y efectiva.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando coaches...</p>
              </div>
            </div>
          ) : coaches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No hay coaches disponibles en este momento.</p>
            </div>
          ) : (
            /* Grid de Coaches */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  onClick={() => openCoachModal(coach)}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-avc-red cursor-pointer"
                >
                  <div className="relative h-64">
                    <Image
                      src={coach.image}
                      alt={coach.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{coach.name}</h3>
                    <p className="text-avc-red font-semibold mb-3">{coach.specialty}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{coach.bio}</p>
                    <div className="mt-4 text-avc-red text-sm font-semibold flex items-center">
                      <span>Ver más detalles</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalles del Coach */}
      {showModal && selectedCoach && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Header con imagen */}
              <div className="relative h-80">
                <Image
                  src={selectedCoach.image}
                  alt={selectedCoach.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent"></div>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition duration-300 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido */}
              <div className="p-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedCoach.name}</h2>
                <p className="text-avc-red text-xl font-semibold mb-6">{selectedCoach.specialty}</p>

                {/* Info básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedCoach.experience && (
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-gray-900 font-semibold">Experiencia</h3>
                      </div>
                      <p className="text-gray-700">{selectedCoach.experience}</p>
                    </div>
                  )}

                  {selectedCoach.favoriteExercise && (
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-gray-900 font-semibold">Ejercicio Favorito</h3>
                      </div>
                      <p className="text-gray-700">{selectedCoach.favoriteExercise}</p>
                    </div>
                  )}
                </div>

                {/* Biografía */}
                {selectedCoach.bio && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Sobre mí
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCoach.bio}</p>
                  </div>
                )}

                {/* Certificaciones */}
                {selectedCoach.certifications && selectedCoach.certifications.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Certificaciones
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedCoach.certifications.map((cert, idx) => (
                        <span 
                          key={idx} 
                          className="bg-red-50 border-2 border-avc-red text-avc-red px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logros */}
                {selectedCoach.achievements && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Logros Destacados
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCoach.achievements}</p>
                  </div>
                )}

                {/* Filosofía */}
                {selectedCoach.philosophy && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-avc-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Mi Filosofía
                    </h3>
                    <div className="bg-gray-50 border-l-4 border-avc-red p-6 rounded-lg">
                      <p className="text-gray-700 leading-relaxed italic">&quot;{selectedCoach.philosophy}&quot;</p>
                    </div>
                  </div>
                )}

                {/* Contacto */}
                {(selectedCoach.email || selectedCoach.instagram) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contacto</h3>
                    <div className="flex flex-wrap gap-4">
                      {selectedCoach.email && (
                        <a
                          href={`mailto:${selectedCoach.email}`}
                          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg transition duration-300 border border-gray-300"
                        >
                          <svg className="w-5 h-5 mr-2 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {selectedCoach.email}
                        </a>
                      )}
                      {selectedCoach.instagram && (
                        <a
                          href={`https://instagram.com/${selectedCoach.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-900 px-4 py-2 rounded-lg transition duration-300"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          {selectedCoach.instagram}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
