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
          <p className="text-xl text-gray-200">¿Tienes dudas? Aquí encontrarás respuestas</p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">FAQ</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <div className="bg-gray-800 rounded-lg">
                        <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left text-white font-semibold hover:bg-gray-750 transition duration-300">
                          <span>{faq.q}</span>
                          <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-6 pb-4 text-gray-400">{faq.a}</Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">¿Tienes otra pregunta?</h2>
              {success && <div className="bg-green-900 border border-green-600 text-white px-4 py-3 rounded mb-6">¡Gracias! Te responderemos pronto.</div>}
              {error && <div className="bg-red-900 border border-red-600 text-white px-4 py-3 rounded mb-6">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">Nombre</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-avc-red transition duration-300" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-avc-red transition duration-300" />
                </div>
                <div>
                  <label htmlFor="question" className="block text-white font-semibold mb-2">Tu pregunta</label>
                  <textarea id="question" name="question" value={formData.question} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-avc-red transition duration-300 resize-none"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-avc-red hover:bg-avc-red-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar Pregunta'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
