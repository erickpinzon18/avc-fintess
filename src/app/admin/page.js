'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [userRole, setUserRole] = useState('admin'); // 'admin' o 'coach'
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Obtener el rol del usuario usando su UID
        await getUserRole(currentUser.uid);
        loadStats();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const getUserRole = async (uid) => {
    try {
      console.log('🔍 Buscando usuario con UID:', uid);
      console.log('📍 Path completo:', `admins/${uid}`);
      
      // Buscar el documento del usuario usando su UID como ID de documento
      const userDocRef = doc(db, 'admins', uid); // ← CAMBIO: 'admins' con S
      const userDocSnap = await getDoc(userDocRef);
      
      console.log('📄 Documento existe?', userDocSnap.exists());
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('✅ Usuario encontrado:', userData);
        console.log('👤 Rol asignado:', userData.role);
        setUserRole(userData.role || 'admin'); // Usar el rol del documento (admin o coach)
      } else {
        // Si no existe en la colección admins, denegar acceso
        console.error('❌ Usuario no encontrado en colección admins con UID:', uid);
        console.log('💡 Verifica que el documento exista en Firestore en: admins/' + uid);
        alert('Tu cuenta no tiene permisos para acceder al panel de administración. UID: ' + uid);
        await signOut(auth);
        router.push('/login');
      }
    } catch (error) {
      console.error('❌ Error al obtener rol:', error);
      console.error('Detalles del error:', error.message);
      alert('Error al verificar permisos: ' + error.message);
    }
  };

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
      roles: ['admin'],
    },
    {
      title: 'Coaches',
      description: 'Gestiona el equipo de entrenadores y sus perfiles',
      icon: '💪',
      href: '/admin/coaches',
      color: 'from-purple-600 to-purple-800',
      roles: ['admin'],
    },
    {
      title: 'Planes/Membresías',
      description: 'Configura planes y precios de membresías',
      icon: '💳',
      href: '/admin/planes',
      color: 'from-teal-600 to-teal-800',
      roles: ['admin'],
    },
    {
      title: 'Calendario/Horarios',
      description: 'Programa las clases semanales y sus horarios',
      icon: '📅',
      href: '/admin/horarios',
      color: 'from-yellow-600 to-yellow-800',
      roles: ['admin'],
    },
    {
      title: 'Testimonios',
      description: 'Administra testimonios y transformaciones de clientes',
      icon: '⭐',
      href: '/admin/testimonios',
      color: 'from-pink-600 to-pink-800',
      roles: ['admin'],
    },
    {
      title: 'Eventos',
      description: 'Gestiona eventos, competencias y actividades especiales',
      icon: '🎉',
      href: '/admin/eventos',
      color: 'from-orange-600 to-orange-800',
      roles: ['admin'],
    },
    {
      title: 'Galería',
      description: 'Administra fotos y videos de las instalaciones',
      icon: '🖼️',
      href: '/admin/galeria',
      color: 'from-blue-600 to-blue-800',
      roles: ['admin'],
    },
    {
      title: 'Blog',
      description: 'Crea y edita artículos del blog',
      icon: '📝',
      href: '/admin/blog',
      color: 'from-indigo-600 to-indigo-800',
      roles: ['admin', 'coach'], // Accesible para admin y coach
    },
  ];

  // Filtrar secciones según el rol del usuario
  const availableSections = adminSections.filter(section => 
    section.roles.includes(userRole)
  );

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
                <p className="text-xs text-gray-600">
                  {userRole === 'admin' ? 'Administrador' : 'Coach'}
                </p>
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
            {userRole === 'coach' 
              ? 'Panel de Coach - Comparte tu conocimiento a través del blog'
              : 'Selecciona una sección para comenzar a editar el contenido'
            }
          </p>
          {userRole === 'coach' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-blue-800">
                👤 <strong>Rol:</strong> Coach | 📝 <strong>Permisos:</strong> Crear y editar artículos del blog
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats - Solo para admins */}
        {userRole === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Clases Activas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.clases || 0}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.coaches || 0}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.eventos || 0}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.blog || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-3xl">📝</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats simplificadas para coaches */}
        {userRole === 'coach' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Mis Artículos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.blog || 0}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <span className="text-3xl">📝</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/blog/editor"
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm mb-1">Acción Rápida</p>
                  <p className="text-xl font-bold">Crear Artículo</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <span className="text-3xl">✏️</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSections.map((section) => (
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
