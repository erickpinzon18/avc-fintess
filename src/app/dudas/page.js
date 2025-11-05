'use client';

import { useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Disclosure } from '@headlessui/react';

export default function DudasPage() {
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addDoc(collection(db, 'feedback'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ name: '', email: '', question: '' });
    } catch (err) {
      console.error('Error:', err);
      setError('Error al enviar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { 
      q: '¿Necesito experiencia previa para CrossFit?', 
      a: 'No. Nuestros entrenadores están capacitados para trabajar con personas que nunca han hecho ejercicio. Todo se adapta a tu nivel. Además, ofrecemos clase muestra GRATIS.' 
    },
    { 
      q: '¿Qué necesito llevar para la clase?', 
      a: 'Ropa deportiva cómoda, una toalla y agua. Todo el equipo lo proporcionamos nosotros (barra olímpica, mancuernas, cuerdas, remadora y bicicleta).' 
    },
    { 
      q: '¿Cómo agendo mi clase muestra?', 
      a: 'Solo escríbenos o llama indicando qué día y horario te interesa. Es totalmente gratis y sin compromiso.' 
    },
    { 
      q: '¿Puedo ir con un amigo o familiar?', 
      a: 'Sí, pueden tomar la clase juntos. También contamos con planes mensuales para parejas (2 personas: $800 c/u) o grupos (3-6 personas: $750 c/u).' 
    },
    { 
      q: '¿Qué es la Zona de Programación?', 
      a: 'Es un espacio exclusivo para entrenar de forma más enfocada en objetivos específicos. Ideal para mejorar técnica, seguir programación personalizada o prepararte para competencias. Incluido en las membresías de CrossFit y Funcional.' 
    },
    { 
      q: '¿Las clases de Indoor Cycling requieren reservación?', 
      a: 'Sí, los lugares son limitados. Es necesario reservar tu lugar con anticipación enviando mensaje. Puedes elegir el horario que más te convenga según disponibilidad.' 
    },
    { 
      q: '¿Funcional Kids requiere experiencia?', 
      a: 'No. Las actividades están diseñadas para niños de 6 a 11 años, con un enfoque 100% lúdico, motivador y seguro. Aprenden jugando sin presión.' 
    },
    { 
      q: '¿Necesito venir en pareja para las clases de Salsa y Cumbia?', 
      a: 'Para nada. Puedes venir sol@, en pareja o con amigos. Todos se integran en las clases que son dinámicas y pensadas desde lo básico.' 
    },
    { 
      q: '¿Necesito ser flexible para la clase de Flexibilidad?', 
      a: 'No. Las clases están diseñadas para todos los niveles. Cada quien avanza a su ritmo. Ideal para mejorar movilidad, prevenir lesiones y complementar cualquier disciplina física.' 
    },
    { 
      q: '¿La Halterofilia tiene clase muestra?', 
      a: 'No. Los entrenamientos son personalizados y enfocados en técnica, por lo que se recomienda compromiso desde la primera sesión. Clase individual: $200 | Mensual: $850.' 
    },
  ];

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image src="https://placehold.co/1920x600/2a2a2a/333333?text=Dudas+AVC" alt="Dudas" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Preguntas <span className="text-avc-red">Frecuentes</span>
          </h1>
          <p className="text-xl text-gray-300">¿Tienes dudas? Aquí encontrarás respuestas</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas <span className="text-avc-red">Más Frecuentes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Aquí encontrarás respuestas a las dudas más comunes. Si no encuentras lo que buscas, 
              no dudes en contactarnos directamente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section - 2 columns */}
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <div className={`bg-gray-100 rounded-lg border ${open ? 'border-avc-red' : 'border-gray-300'} transition-all duration-300`}>
                        <Disclosure.Button className="flex justify-between items-start w-full px-6 py-5 text-left text-gray-900 font-semibold hover:bg-gray-50 transition duration-300 group">
                          <span className="pr-4 group-hover:text-avc-red transition-colors">{faq.q}</span>
                          <svg 
                            className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-avc-red' : 'text-gray-600'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-6 pb-5 text-gray-700 leading-relaxed">
                          {faq.a}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                ))}
              </div>

              {/* Contact Info Below FAQs */}
              <div className="mt-8 bg-linear-to-r from-avc-red to-red-700 rounded-xl p-6 text-gray-900">
                <div className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">¿No encontraste lo que buscabas?</h3>
                    <p className="text-gray-900 text-opacity-90">
                      Contáctanos directamente y con gusto te atenderemos. Estamos disponibles por WhatsApp, 
                      teléfono o puedes visitarnos en nuestras instalaciones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - 1 column - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="bg-avc-red bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-avc-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes otra pregunta?</h3>
                    <p className="text-gray-600 text-sm">Envíanos tu duda y te responderemos pronto</p>
                  </div>

                  {success && (
                    <div className="bg-green-900 border border-green-600 text-gray-900 px-4 py-3 rounded-lg mb-4 text-sm">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ¡Gracias! Te responderemos pronto.
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-900 border border-red-600 text-gray-900 px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-900 font-semibold mb-2 text-sm">
                        Nombre completo
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-avc-red focus:ring-1 focus:ring-avc-red transition duration-300 text-sm" 
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-900 font-semibold mb-2 text-sm">
                        Correo electrónico
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-avc-red focus:ring-1 focus:ring-avc-red transition duration-300 text-sm" 
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="question" className="block text-gray-900 font-semibold mb-2 text-sm">
                        Tu pregunta
                      </label>
                      <textarea 
                        id="question" 
                        name="question" 
                        value={formData.question} 
                        onChange={handleChange} 
                        required 
                        rows={4} 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-avc-red focus:ring-1 focus:ring-avc-red transition duration-300 resize-none text-sm" 
                        placeholder="Escribe tu pregunta aquí..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-avc-red hover:bg-red-700 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Pregunta
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
