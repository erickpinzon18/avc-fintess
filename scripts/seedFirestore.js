/**
 * Script para poblar Firestore con datos de ejemplo
 * 
 * INSTRUCCIONES:
 * 1. Asegúrate de tener configuradas las variables de entorno en .env.local
 * 2. Ejecuta: node scripts/seedFirestore.js
 * 
 * NOTA: Este es un script de ejemplo. Ajusta los datos según tus necesidades.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de ejemplo
const coaches = [
  {
    name: 'Carlos Mendoza',
    specialty: 'CrossFit L1, Halterofilia',
    bio: 'Apasionado por el fitness con más de 8 años de experiencia. Le encanta motivar y ver el progreso de cada atleta.',
    imageUrl: 'https://placehold.co/400x400/dc2626/white?text=Carlos',
  },
  {
    name: 'Ana Rodríguez',
    specialty: 'CrossFit L2, Nutrición',
    bio: 'Especialista en ayudar a principiantes. Combina entrenamiento con consejos nutricionales.',
    imageUrl: 'https://placehold.co/400x400/1a1a1a/white?text=Ana',
  },
  {
    name: 'Luis Gómez',
    specialty: 'Halterofilia, Movilidad',
    bio: 'Ex competidor nacional de halterofilia. Perfeccionista de la técnica y gran mentor.',
    imageUrl: 'https://placehold.co/400x400/333333/white?text=Luis',
  },
  {
    name: 'María Sánchez',
    specialty: 'Yoga, Funcional',
    bio: 'Instructora certificada de yoga. Aporta equilibrio y consciencia corporal al equipo.',
    imageUrl: 'https://placehold.co/400x400/555555/white?text=Maria',
  },
];

const testimonials = [
  {
    name: 'Pedro Martínez',
    memberSince: '2022',
    testimonial:
      'AVC cambió mi vida. No solo mejoré mi condición física, también encontré una familia que me motiva cada día.',
    imageUrl: 'https://placehold.co/200x200/dc2626/white?text=PM',
    rating: 5,
  },
  {
    name: 'Laura Fernández',
    memberSince: '2021',
    testimonial:
      'Los coaches son increíbles. Siempre atentos, motivadores y preocupados por tu técnica y progreso.',
    imageUrl: 'https://placehold.co/200x200/1a1a1a/white?text=LF',
    rating: 5,
  },
  {
    name: 'Javier Ruiz',
    memberSince: '2023',
    testimonial:
      'Llegué sin experiencia y con miedo. Ahora el gimnasio es mi lugar favorito. ¡Gracias AVC!',
    imageUrl: 'https://placehold.co/200x200/333333/white?text=JR',
    rating: 5,
  },
];

const posts = [
  {
    slug: 'beneficios-crossfit',
    title: '5 Beneficios del CrossFit que no conocías',
    excerpt:
      'Descubre cómo el CrossFit puede transformar no solo tu cuerpo, sino también tu mentalidad y estilo de vida.',
    content:
      '<h2>Introducción</h2><p>El CrossFit es mucho más que un entrenamiento físico...</p><h2>1. Mejora la salud cardiovascular</h2><p>Los WODs de alta intensidad...</p>',
    imageUrl: 'https://placehold.co/800x400/dc2626/white?text=CrossFit+Benefits',
    category: 'Entrenamiento',
    author: 'Carlos Mendoza',
  },
  {
    slug: 'nutricion-para-atletas',
    title: 'Guía de Nutrición para Atletas de CrossFit',
    excerpt:
      'Aprende qué comer antes y después del entrenamiento para maximizar tus resultados.',
    content:
      '<h2>La Importancia de la Nutrición</h2><p>Tu rendimiento depende de lo que comes...</p>',
    imageUrl: 'https://placehold.co/800x400/1a1a1a/white?text=Nutrition+Guide',
    category: 'Nutrición',
    author: 'Ana Rodríguez',
  },
];

const events = [
  {
    title: 'Open de CrossFit 2025',
    description: 'Participa en el evento más grande de CrossFit del año',
    date: new Date('2025-02-15'),
    imageUrl: 'https://placehold.co/800x400/dc2626/white?text=Open+2025',
    location: 'AVC Fitness',
  },
  {
    title: 'Workshop de Halterofilia',
    description: 'Mejora tu técnica con expertos internacionales',
    date: new Date('2025-01-20'),
    imageUrl: 'https://placehold.co/800x400/1a1a1a/white?text=Workshop',
    location: 'AVC Fitness',
  },
];

const socialPosts = [
  {
    type: 'instagram',
    imageUrl: 'https://placehold.co/400x400/dc2626/white?text=Instagram+1',
    caption: '¡WOD épico de hoy! 💪 #AVCFitness #CrossFit',
    likes: 245,
    platform: '@avcfitness',
  },
  {
    type: 'tiktok',
    imageUrl: 'https://placehold.co/400x600/1a1a1a/white?text=TikTok+Video',
    caption: 'Tutorial: Cómo hacer un Snatch perfecto 🏋️',
    likes: 1200,
    platform: '@avcfitness',
  },
  {
    type: 'youtube',
    imageUrl: 'https://placehold.co/600x400/555555/white?text=YouTube+Video',
    caption: 'Día en la vida de un atleta AVC',
    likes: 567,
    platform: 'AVC Fitness',
  },
];

async function seedData() {
  try {
    console.log('🔥 Iniciando población de Firestore...\n');

    // Coaches
    console.log('👨‍🏫 Agregando coaches...');
    for (const coach of coaches) {
      await addDoc(collection(db, 'coaches'), {
        ...coach,
        createdAt: serverTimestamp(),
      });
      console.log(`  ✓ ${coach.name}`);
    }

    // Testimonials
    console.log('\n💬 Agregando testimonios...');
    for (const testimonial of testimonials) {
      await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        createdAt: serverTimestamp(),
      });
      console.log(`  ✓ ${testimonial.name}`);
    }

    // Posts
    console.log('\n📝 Agregando posts del blog...');
    for (const post of posts) {
      await addDoc(collection(db, 'posts'), {
        ...post,
        publishedAt: serverTimestamp(),
      });
      console.log(`  ✓ ${post.title}`);
    }

    // Events
    console.log('\n🎉 Agregando eventos...');
    for (const event of events) {
      await addDoc(collection(db, 'events'), event);
      console.log(`  ✓ ${event.title}`);
    }

    // Social Posts
    console.log('\n📱 Agregando posts de redes sociales...');
    for (const socialPost of socialPosts) {
      await addDoc(collection(db, 'socialPosts'), {
        ...socialPost,
        createdAt: serverTimestamp(),
      });
      console.log(`  ✓ ${socialPost.caption}`);
    }

    console.log('\n✅ ¡Datos agregados exitosamente!');
    console.log('\n🚀 Tu sitio ya tiene contenido de ejemplo en Firestore.');
    console.log('👉 Ejecuta "npm run dev" y visita http://localhost:3000\n');
  } catch (error) {
    console.error('❌ Error al poblar Firestore:', error);
  } finally {
    process.exit();
  }
}

seedData();
