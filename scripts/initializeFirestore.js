// Script para inicializar Firestore con datos de ejemplo
// Ejecutar con: node scripts/initializeFirestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialData = {
  // Colección de clases
  clases: [
    {
      id: 'crossfit',
      name: 'CrossFit',
      description: 'Entrenamiento funcional de alta intensidad que combina fuerza, técnica y cardio.',
      target: 'Todos los niveles',
      benefits: 'Fuerza, resistencia, técnica',
      price: 'Individual: $80 | Mensual: $850',
      promo: '',
      image: 'https://placehold.co/600x400/dc2626/white?text=CrossFit',
      freeTrial: true,
      trialPrice: '',
    },
    {
      id: 'funcional',
      name: 'Funcional',
      description: 'Entrenamiento completo para aumentar masa muscular y resistencia.',
      target: 'Todos los niveles',
      benefits: 'Rendimiento físico, salud integral',
      price: 'Individual: $60 | Mensual: $800',
      promo: '',
      image: 'https://placehold.co/600x400/1a1a1a/white?text=Funcional',
      freeTrial: true,
      trialPrice: '',
    },
  ],

  // Colección de coaches
  coaches: [
    {
      id: 'coach-1',
      name: 'Juan Pérez',
      specialty: 'CrossFit Level 2',
      bio: 'Entrenador certificado con 5 años de experiencia.',
      image: 'https://placehold.co/300x300/dc2626/white?text=JP',
      certifications: ['CrossFit Level 2', 'Halterofilia'],
      email: 'juan@avcfitness.com',
      instagram: '@juancoach',
    },
  ],

  // Colección de planes/membresías
  planes: [
    {
      id: 'crossfit-mensual',
      name: 'CrossFit Mensual',
      price: 850,
      duration: 'Mensual',
      description: 'Acceso ilimitado a clases de CrossFit',
      features: ['Clases ilimitadas de CrossFit', 'Zona de Programación', 'Plan de entrenamiento personalizado'],
      popular: true,
    },
    {
      id: 'funcional-mensual',
      name: 'Funcional Mensual',
      price: 800,
      duration: 'Mensual',
      description: 'Entrenamiento funcional completo',
      features: ['Clases ilimitadas de Funcional', 'Acceso al área de pesas', 'Asesoría nutricional básica'],
      popular: false,
    },
    {
      id: 'premium-trimestral',
      name: 'Plan Premium Trimestral',
      price: 2400,
      duration: 'Trimestral (3 meses)',
      description: 'Acceso total a todas las instalaciones y clases',
      features: [
        'Todas las clases ilimitadas',
        'Acceso 24/7 al gimnasio',
        'Plan nutricional completo',
        'Evaluaciones mensuales',
        '2 sesiones de PT gratis'
      ],
      popular: false,
    },
  ],

  // Colección de calendario/horarios de clases
  calendario: [
    {
      id: 'crossfit-lunes-am',
      clase: 'CrossFit',
      dia: 'Lunes',
      horaInicio: '06:00',
      horaFin: '07:00',
      instructor: 'Coach Juan',
      capacidadMaxima: 15,
      nivel: 'Todos los niveles',
      duracion: 60,
    },
    {
      id: 'crossfit-lunes-pm',
      clase: 'CrossFit',
      dia: 'Lunes',
      horaInicio: '18:00',
      horaFin: '19:00',
      instructor: 'Coach María',
      capacidadMaxima: 15,
      nivel: 'Todos los niveles',
      duracion: 60,
    },
    {
      id: 'funcional-martes-am',
      clase: 'Funcional',
      dia: 'Martes',
      horaInicio: '07:00',
      horaFin: '08:00',
      instructor: 'Coach Pedro',
      capacidadMaxima: 20,
      nivel: 'Principiante',
      duracion: 60,
    },
    {
      id: 'zumba-miercoles-pm',
      clase: 'Zumba',
      dia: 'Miércoles',
      horaInicio: '19:00',
      horaFin: '20:00',
      instructor: 'Coach Laura',
      capacidadMaxima: 25,
      nivel: 'Todos los niveles',
      duracion: 60,
    },
    {
      id: 'cycling-jueves-am',
      clase: 'Indoor Cycling',
      dia: 'Jueves',
      horaInicio: '06:30',
      horaFin: '07:30',
      instructor: 'Coach Ana',
      capacidadMaxima: 20,
      nivel: 'Intermedio',
      duracion: 60,
    },
    {
      id: 'funcional-viernes-pm',
      clase: 'Funcional',
      dia: 'Viernes',
      horaInicio: '18:00',
      horaFin: '19:00',
      instructor: 'Coach Carlos',
      capacidadMaxima: 20,
      nivel: 'Avanzado',
      duracion: 60,
    },
    {
      id: 'crossfit-sabado-am',
      clase: 'CrossFit',
      dia: 'Sábado',
      horaInicio: '09:00',
      horaFin: '10:00',
      instructor: 'Coach Juan',
      capacidadMaxima: 15,
      nivel: 'Todos los niveles',
      duracion: 60,
    },
  ],

  // Colección de testimonios
  testimonios: [
    {
      id: 'testimonio-1',
      name: 'Ana García',
      memberSince: '2022',
      testimonial: 'AVC cambió mi vida completamente.',
      image: 'https://placehold.co/200x200/333333/white?text=AG',
      rating: 5,
      program: 'CrossFit',
    },
  ],

  // Colección de eventos
  eventos: [
    {
      id: 'evento-1',
      title: 'Competencia AVC Open 2025',
      description: 'Competencia interna de CrossFit',
      date: new Date('2025-12-15'),
      location: 'AVC Fitness Center',
      image: 'https://placehold.co/800x400/dc2626/white?text=Evento',
      isUpcoming: true,
      category: 'Competencia',
    },
  ],

  // Colección de galería
  galeria: [
    {
      id: 'galeria-1',
      type: 'image',
      url: 'https://placehold.co/600x400/dc2626/white?text=WOD',
      caption: 'Intensidad en cada WOD',
      category: 'Entrenamientos',
    },
  ],

  // Colección de blog
  blog: [
    {
      id: 'post-1',
      slug: 'mitos-proteina-crossfit',
      title: '5 Mitos sobre la Proteína',
      excerpt: 'Descubre la verdad sobre el consumo de proteína.',
      content: '<h2>Mito #1</h2><p>La verdad es...</p>',
      author: 'Juan Pérez',
      category: 'Nutrición',
      image: 'https://placehold.co/800x400/333333/white?text=Blog',
      tags: ['nutrición', 'proteína'],
      publishedAt: new Date(),
      isPublished: true,
    },
  ],
};

async function initializeFirestore() {
  console.log('\n🔥 Inicializando Firestore con datos de ejemplo\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Inicializar colecciones
    for (const [collectionName, documents] of Object.entries(initialData)) {
      console.log(`📦 Creando colección: ${collectionName}...`);
      
      for (const docData of documents) {
        const { id, ...data } = docData;
        await setDoc(doc(db, collectionName, id), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`  ✅ Documento ${id} creado`);
      }
      console.log();
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ¡Firestore inicializado correctamente!\n');
    console.log('Colecciones configurables creadas:');
    console.log('  - clases');
    console.log('  - coaches');
    console.log('  - planes (membresías)');
    console.log('  - calendario (horarios de clases)');
    console.log('  - testimonios');
    console.log('  - eventos');
    console.log('  - galeria');
    console.log('  - blog\n');
    console.log('Ahora puedes:');
    console.log('  1. Crear usuario admin: npm run create-admin');
    console.log('  2. Iniciar sesión en: /login');
    console.log('  3. Gestionar contenido en: /admin\n');

  } catch (error) {
    console.error('❌ Error al inicializar Firestore:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Ejecutar
initializeFirestore();
