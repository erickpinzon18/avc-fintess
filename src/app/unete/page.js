'use client';

import { useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UnetePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membership: 'premium',
    goals: '',
    experience: 'beginner',
    startDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addDoc(collection(db, 'newMembers'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending',
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membership: 'premium',
        goals: '',
        experience: 'beginner',
        startDate: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Hubo un error al procesar tu inscripción. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x1080/dc2626/333333?text=Unite+a+AVC+Fitness"
            alt="Únete a AVC Fitness"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8">
            Es tu momento de <span className="text-avc-red">brillar</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Da el primer paso hacia la mejor versión de ti mismo. Únete a la familia AVC Fitness
            Center y descubre todo lo que puedes lograr.
          </p>

          {/* Beneficios Destacados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl border border-avc-red">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clases Ilimitadas</h3>
              <p className="text-gray-700">Acceso a todas nuestras actividades</p>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl border border-avc-red">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad Increíble</h3>
              <p className="text-gray-700">Haz amigos y entrena con motivación</p>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl border border-avc-red">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coaches Expertos</h3>
              <p className="text-gray-700">Guía profesional en cada sesión</p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 mx-auto text-avc-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE INSCRIPCIÓN */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¡Comienza <span className="text-avc-red">Hoy</span>!
              </h2>
              <p className="text-lg text-gray-700">
                Completa el formulario y nos pondremos en contacto contigo para agendar tu clase
                de prueba gratuita.
              </p>
            </div>

            {success && (
              <div className="bg-green-900 border-2 border-green-600 text-gray-900 px-6 py-4 rounded-xl mb-8 text-center">
                <h3 className="text-xl font-bold mb-2">¡Bienvenido a la familia AVC! 🎉</h3>
                <p>
                  Hemos recibido tu información. Nos pondremos en contacto contigo muy pronto
                  para coordinar tu primera clase.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-900 border-2 border-red-600 text-gray-900 px-6 py-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-gray-100 rounded-2xl p-8 md:p-12 border-2 border-gray-300 shadow-2xl"
            >
              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-gray-900 font-semibold mb-2 text-lg">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                    placeholder="Juan Pérez"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-900 font-semibold mb-2 text-lg">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-gray-900 font-semibold mb-2 text-lg">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                    placeholder="+52 55 1234 5678"
                  />
                </div>

                {/* Membresía */}
                <div>
                  <label
                    htmlFor="membership"
                    className="block text-gray-900 font-semibold mb-2 text-lg"
                  >
                    Membresía deseada *
                  </label>
                  <select
                    id="membership"
                    name="membership"
                    value={formData.membership}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                  >
                    <option value="basica">Básica - $50/mes</option>
                    <option value="premium">Premium - $80/mes (Recomendada)</option>
                    <option value="elite">Elite - $120/mes</option>
                  </select>
                </div>

                {/* Experiencia */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-gray-900 font-semibold mb-2 text-lg"
                  >
                    Nivel de experiencia *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                  >
                    <option value="beginner">Principiante - Nunca he entrenado</option>
                    <option value="intermediate">Intermedio - Tengo algo de experiencia</option>
                    <option value="advanced">Avanzado - Entreno regularmente</option>
                  </select>
                </div>

                {/* Fecha de Inicio */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-gray-900 font-semibold mb-2 text-lg"
                  >
                    ¿Cuándo te gustaría comenzar?
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300"
                  />
                </div>

                {/* Objetivos */}
                <div>
                  <label htmlFor="goals" className="block text-gray-900 font-semibold mb-2 text-lg">
                    ¿Cuáles son tus objetivos? *
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:border-avc-red transition duration-300 resize-none"
                    placeholder="Ej: Quiero perder peso, ganar fuerza, mejorar mi salud..."
                  ></textarea>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-avc-red hover:bg-avc-red-dark text-gray-900 font-bold py-5 px-8 rounded-xl text-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? 'Procesando...' : '¡Quiero unirme a AVC! 🚀'}
                </button>

                <p className="text-center text-gray-600 text-sm mt-4">
                  * Al enviar este formulario, aceptas nuestros términos y condiciones.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION ADICIONAL: ¿Por qué Unirte? */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            ¿Por qué elegir <span className="text-avc-red">AVC Fitness</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resultados Reales</h3>
              <p className="text-gray-600">
                Programas diseñados por expertos para garantizar tu progreso.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instalaciones de Primera</h3>
              <p className="text-gray-600">
                Equipamiento de calidad y espacios amplios y limpios.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Horarios Flexibles</h3>
              <p className="text-gray-600">
                Clases desde las 6 AM hasta las 10 PM, adaptadas a tu vida.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Primera Clase Gratis</h3>
              <p className="text-gray-600">
                Prueba sin compromiso y descubre la experiencia AVC.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
