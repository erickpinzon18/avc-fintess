'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadStats();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadStats = async () => {
    try {
      const collections = ['clases', 'coaches', 'planes', 'calendario', 'testimonios', 'eventos', 'galeria', 'blog'];
      const counts = {};

      for (const collectionName of collections) {
        const col = collection(db, collectionName);
        const snapshot = await getDocs(col);
        counts[collectionName] = snapshot.size;
      }

      setStats(counts);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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

  if (!user) {
    return null;
  }

  const adminSections = [
    {
      title: 'Clases',
      description: 'Administra todas las clases, precios y promociones',
      icon: '🏋️',
      href: '/admin/clases',
      color: 'from-green-600 to-green-800',
    },
    {
      title: 'Coaches',
      description: 'Gestiona el equipo de entrenadores y sus perfiles',
      icon: '💪',
      href: '/admin/coaches',
      color: 'from-purple-600 to-purple-800',
    },
    {
      title: 'Planes/Membresías',
      description: 'Configura planes y precios de membresías',
      icon: '💳',
      href: '/admin/planes',
      color: 'from-teal-600 to-teal-800',
    },
    {
      title: 'Calendario/Horarios',
      description: 'Programa las clases semanales y sus horarios',
      icon: '📅',
      href: '/admin/horarios',
      color: 'from-yellow-600 to-yellow-800',
    },
    {
      title: 'Testimonios',
      description: 'Administra testimonios y transformaciones de clientes',
      icon: '⭐',
      href: '/admin/testimonios',
      color: 'from-pink-600 to-pink-800',
    },
    {
      title: 'Eventos',
      description: 'Gestiona eventos, competencias y actividades especiales',
      icon: '🎉',
      href: '/admin/eventos',
      color: 'from-orange-600 to-orange-800',
    },
    {
      title: 'Galería',
      description: 'Administra fotos y videos de las instalaciones',
      icon: '🖼️',
      href: '/admin/galeria',
      color: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Blog',
      description: 'Crea y edita artículos del blog',
      icon: '📝',
      href: '/admin/blog',
      color: 'from-indigo-600 to-indigo-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/logo.png"
                alt="AVC Fitness Center"
                width={150}
                height={45}
                className="h-12 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Gestiona todo el contenido del sitio web</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-600">Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-avc-red hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido de nuevo 👋
          </h2>
          <p className="text-lg text-gray-600">
            Selecciona una sección para comenzar a editar el contenido
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Clases Activas</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-3xl">🏋️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Coaches</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-3xl">💪</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Eventos</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-3xl">🎉</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Artículos Blog</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-avc-red transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`bg-gradient-to-br ${section.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{section.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-avc-red transition-colors duration-300">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {section.description}
              </p>
              <div className="mt-4 flex items-center text-avc-red text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Configurar</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        {/* <div className="mt-12 bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-8 border border-red-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-red-200">
                Consulta la documentación o contacta al equipo de soporte
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white text-red-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">
                Ver Documentación
              </button>
              <Link
                href="/"
                className="bg-red-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Ver Sitio Web
              </Link>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}
