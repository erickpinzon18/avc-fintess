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

const classes = [
  {
    name: 'CrossFit',
    description: 'Entrenamiento funcional de alta intensidad que combina fuerza, técnica y cardio. Trabajamos con barra olímpica, movimientos gimnásticos, mancuernas, cuerdas, remadora y bicicleta.',
    target: 'Todos los niveles, sin experiencia previa necesaria.',
    benefits: 'Desarrollo equilibrado de todo el cuerpo, fuerza, resistencia y técnica.',
    price: 'Clase individual: $80 | Mensual: $850 | Pareja: $800 c/u | Equipo (3-6): $750 c/u',
    image: 'https://placehold.co/600x400/dc2626/white?text=CrossFit',
    freeTrial: true,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Funcional',
    description: 'Entrenamiento completo diseñado para aumentar masa muscular, mejorar composición corporal e incrementar resistencia cardiovascular.',
    target: 'Todos los niveles, adaptado completamente a tu nivel.',
    benefits: 'Mejor rendimiento físico, salud integral y resistencia.',
    price: 'Clase individual: $60 | Semanal: $250 | Mensual: $800',
    image: 'https://placehold.co/600x400/1a1a1a/white?text=Funcional',
    freeTrial: true,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Halterofilia',
    description: 'Entrenamiento especializado en desarrollar fuerza y potencia con barra olímpica. Aprende Arranque (Snatch) y Envión (Clean & Jerk).',
    target: 'Desde principiantes hasta avanzados con enfoque en técnica.',
    benefits: 'Fuerza explosiva, coordinación, potencia y control corporal.',
    price: 'Clase individual: $200 | Mensual: $850',
    image: 'https://placehold.co/600x400/333333/white?text=Halterofilia',
    freeTrial: false,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Indoor Cycling',
    description: 'Clase tipo spinning con música, luces y mucha energía. Mejora tu resistencia cardiovascular mientras quemas calorías.',
    target: 'Todos los niveles, tú marcas tu ritmo.',
    benefits: 'Resistencia cardiovascular, quema de calorías, libera estrés.',
    price: 'Individual: $85 | 12 clases: $900 | 15 clases: $1,050 | 20 clases: $1,400',
    image: 'https://placehold.co/600x400/555555/white?text=Indoor+Cycling',
    freeTrial: false,
    promo: 'Paga 10 clases y recibe 12 por $750',
    trialPrice: '$50',
  },
  {
    name: 'Zumba',
    description: '¡Ejercicio, ritmo y diversión! Baila al ritmo de distintos géneros musicales mientras quemas calorías y liberas estrés.',
    target: 'Todas las edades, sin experiencia necesaria.',
    benefits: 'Quema de calorías, mejora cardiovascular, diversión.',
    price: '1 clase: $45 | 3 clases: $120 | 6 clases: $240 | 9 clases: $320 | 12 clases: $420',
    image: 'https://placehold.co/600x400/ff1493/white?text=Zumba',
    freeTrial: false,
    promo: '¡2x1 en clases este mes!',
    trialPrice: '',
  },
  {
    name: 'Funcional Kids',
    description: 'Versión adaptada del entrenamiento funcional para niños de 6 a 11 años. A través de juegos y ejercicios seguros desarrollan coordinación y fuerza.',
    target: 'Niños de 6 a 11 años.',
    benefits: 'Coordinación, fuerza, confianza y diversión.',
    price: 'Clase individual: $85 | Mensual: $500',
    image: 'https://placehold.co/600x400/ffa500/white?text=Funcional+Kids',
    freeTrial: false,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Salsa y Cumbia',
    description: 'Aprende pasos básicos, movimientos con estilo y coreografías sencillas mientras disfrutas de la música. No necesitas pareja.',
    target: 'Todas las edades, sin experiencia previa.',
    benefits: 'Mejora tu ritmo, coordinación y confianza.',
    price: '1 clase (2 hrs): $60 | 4 clases: $200',
    image: 'https://placehold.co/600x400/ff6347/white?text=Salsa+y+Cumbia',
    freeTrial: false,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Flexibilidad',
    description: 'Clase enfocada en estiramientos controlados, técnicas de movilidad y respiración. Previene lesiones y mejora amplitud de movimiento.',
    target: 'Todos los niveles, complementa cualquier disciplina.',
    benefits: 'Mejor movilidad, prevención de lesiones, menos tensiones.',
    price: 'Socios AVC: $60 | Externos: $100',
    image: 'https://placehold.co/600x400/9370db/white?text=Flexibilidad',
    freeTrial: false,
    promo: '',
    trialPrice: '',
  },
  {
    name: 'Eventos Especiales',
    description: 'Clases temáticas, retos y convivencias diseñadas para toda la comunidad AVC. Una oportunidad única de integración y diversión.',
    target: 'Toda la comunidad AVC.',
    benefits: 'Diversión, integración, motivación y retos únicos.',
    price: 'Varía según el evento - Consulta en recepción',
    image: 'https://placehold.co/600x400/999999/white?text=Eventos',
    freeTrial: false,
    promo: '',
    trialPrice: '',
  },
];

async function addClasses() {
  try {
    console.log('🔄 Agregando clases a Firestore...\n');

    for (const clase of classes) {
      const docRef = await addDoc(collection(db, 'clases'), {
        ...clase,
        createdAt: new Date(),
      });
      console.log(`✅ ${clase.name} agregado con ID: ${docRef.id}`);
    }

    console.log('\n✅ Todas las clases han sido agregadas exitosamente!');
    console.log(`📊 Total de clases agregadas: ${classes.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar clases:', error);
    process.exit(1);
  }
}

addClasses();
