'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ClasesPage() {
  const classesRef = useScrollAnimation({ stagger: 0.15 });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState('https://placehold.co/1920x600/2a2a2a/333333?text=Nuestras+Clases+AVC');

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const clasesCol = collection(db, 'clases');
        const clasesSnapshot = await getDocs(clasesCol);
        const clasesList = clasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClasses(clasesList);
        
        // Si hay clases y alguna tiene coverImage, usar la primera que encuentre
        const claseConPortada = clasesList.find(clase => clase.coverImage);
        if (claseConPortada && claseConPortada.coverImage) {
          setCoverImage(claseConPortada.coverImage);
        }
      } catch (error) {
        console.error('Error al cargar clases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: `${classes.find(c => c.coverImage)?.coverImagePosition?.x || 50}% ${classes.find(c => c.coverImage)?.coverImagePosition?.y || 50}%`,
            }}
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Encuentra tu <span className="text-avc-red">pasión</span>
          </h1>
          <p className="text-xl text-gray-200">
            Tenemos una variedad de clases y actividades diseñadas para cada nivel y objetivo.
          </p>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Explora nuestras <span className="text-avc-red">Actividades</span>
            </h2>
            <p className="text-lg text-gray-700">
              Desde alta intensidad hasta movilidad y diversión, tenemos algo para ti. Cada
              clase está diseñada para motivarte y ayudarte a alcanzar tus metas en un
              ambiente increíble.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando clases...</p>
              </div>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No hay clases disponibles en este momento.</p>
            </div>
          ) : (
            <>
              {/* Grid de Clases */}
              <div
                ref={classesRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {classes.map((clase, index) => (
                  <div
                    key={clase.id}
                    data-animate
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-avc-red"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${clase.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: `${clase.imagePosition?.x || 50}% ${clase.imagePosition?.y || 50}%`,
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{clase.name}</h3>
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{clase.description}</p>
                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="text-avc-red font-semibold text-sm">Dirigido a:</span>
                          <p className="text-gray-600 text-sm">{clase.target}</p>
                        </div>
                        <div>
                          <span className="text-avc-red font-semibold text-sm">Beneficios:</span>
                          <p className="text-gray-600 text-sm">{clase.benefits}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <span className="text-avc-red font-semibold text-sm mb-2 block">Precios:</span>
                          <div className="space-y-2">
                            {clase.price.split('|').map((precio, idx) => (
                              <div 
                                key={idx}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                              >
                                <p className="text-gray-700 text-xs leading-relaxed">{precio.trim()}</p>
                              </div>
                            ))}
                          </div>
                          {clase.promo && (
                            <div className="bg-green-50 border border-green-500 rounded-lg px-3 py-2 mt-2">
                              <p className="text-green-700 text-xs font-semibold">🎉 {clase.promo}</p>
                            </div>
                          )}
                          {clase.freeTrial && (
                            <div className="bg-green-50 border border-green-500 rounded-lg px-3 py-2 mt-2">
                              <p className="text-green-700 text-xs font-semibold">✨ Clase muestra GRATIS</p>
                            </div>
                          )}
                          {clase.trialPrice && (
                            <div className="bg-yellow-50 border border-yellow-500 rounded-lg px-3 py-2 mt-2">
                              <p className="text-yellow-700 text-xs font-semibold">💰 Clase muestra: {clase.trialPrice}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-16">
                <Link
                  href="/horarios"
                  className="bg-avc-red hover:bg-avc-red-dark text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105 text-lg inline-block"
                >
                  Ver horarios y reservar
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
