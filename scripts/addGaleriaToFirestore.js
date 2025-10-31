import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const galeriaItems = [
  {
    title: 'Área de CrossFit',
    description: 'Zona principal de entrenamiento funcional con todo el equipamiento necesario',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    category: 'Instalaciones',
    order: 0,
    createdAt: new Date(),
  },
  {
    title: 'Zona de Halterofilia',
    description: 'Plataformas especializadas para levantamiento olímpico',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'Instalaciones',
    order: 1,
    createdAt: new Date(),
  },
  {
    title: 'Clase de CrossFit',
    description: 'Entrenamiento grupal con nuestros coaches certificados',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    category: 'Clases',
    order: 2,
    createdAt: new Date(),
  },
  {
    title: 'Equipamiento de Gimnasia',
    description: 'Anillas, barras de dominadas y todo para gimnasia funcional',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    category: 'Equipamiento',
    order: 3,
    createdAt: new Date(),
  },
  {
    title: 'Zona de Cardio',
    description: 'Rowers, assault bikes y más equipos de cardio',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'Equipamiento',
    order: 4,
    createdAt: new Date(),
  },
  {
    title: 'Comunidad AVC',
    description: 'Nuestra familia entrenando juntos',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
    category: 'Comunidad',
    order: 5,
    createdAt: new Date(),
  },
  {
    title: 'Competencia Interna',
    description: 'Eventos y competencias para nuestra comunidad',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'Eventos',
    order: 6,
    createdAt: new Date(),
  },
  {
    title: 'Técnica de Snatch',
    description: 'Perfeccionando la técnica de levantamiento olímpico',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'Clases',
    order: 7,
    createdAt: new Date(),
  },
  {
    title: 'Box Jumps',
    description: 'Entrenamiento de potencia y explosividad',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    category: 'Clases',
    order: 8,
    createdAt: new Date(),
  },
];

async function addGaleriaToFirestore() {
  try {
    console.log('🚀 Iniciando carga de galería a Firestore...\n');

    for (const item of galeriaItems) {
      const docRef = await addDoc(collection(db, 'galeria'), item);
      console.log(`✅ Agregado: ${item.title} (${item.category}) - ID: ${docRef.id}`);
    }

    console.log(`\n🎉 ¡${galeriaItems.length} elementos agregados exitosamente a la galería!`);
    console.log('📸 Puedes verlos en /admin/galeria y /galeria');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar galería:', error);
    process.exit(1);
  }
}

addGaleriaToFirestore();
