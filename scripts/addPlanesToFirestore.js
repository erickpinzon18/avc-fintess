import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

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

const planes = [
  {
    name: 'CrossFit',
    price: '850',
    period: '/mes',
    description: 'El programa más completo para transformar tu cuerpo y mente',
    features: [
      'Clase individual: $80',
      'Mensual individual: $850',
      'Pareja (2 personas): $800 c/u',
      'Equipo (3-6 personas): $750 c/u',
      'Clase muestra GRATIS'
    ],
    popular: true,
    color: 'red',
    icon: '🏋️',
    benefits: [
      'Acceso a Zona de Programación',
      'Clases grupales ilimitadas',
      'Comunidad activa y motivadora',
      'Coaches certificados'
    ],
    order: 1
  },
  {
    name: 'Funcional',
    price: '800',
    period: '/mes',
    description: 'Entrenamiento funcional adaptado a todos los niveles',
    features: [
      'Clase individual: $60',
      'Semanal: $250',
      'Mensual: $800',
      'Incluye acceso a Zona de Programación',
      'Clase muestra GRATIS'
    ],
    popular: false,
    color: 'blue',
    icon: '💪',
    benefits: [
      'Mejora tu condición física',
      'Reduce riesgo de lesiones',
      'Fortalece todo el cuerpo',
      'Horarios flexibles'
    ],
    order: 2
  },
  {
    name: 'Halterofilia',
    price: '850',
    period: '/mes',
    description: 'Técnica olímpica con entrenamiento personalizado',
    features: [
      'Clase individual: $200',
      'Mensual: $850',
      'Entrenamiento personalizado',
      'Enfoque en técnica olímpica',
      'Programación especializada'
    ],
    popular: false,
    color: 'orange',
    icon: '🏆',
    benefits: [
      'Coaches especializados',
      'Mejora tu técnica',
      'Aumenta tu fuerza',
      'Preparación para competencias'
    ],
    order: 3
  },
  {
    name: 'Indoor Cycling',
    price: '900',
    period: '12 clases',
    description: 'Quema calorías al ritmo de la mejor música',
    features: [
      'Clase individual: $85',
      '12 clases: $900',
      '15 clases: $1,050',
      '20 clases: $1,400',
      'Promo: 10 clases x $750 (recibes 12)'
    ],
    popular: false,
    color: 'purple',
    icon: '🚴',
    benefits: [
      'Alta quema de calorías',
      'Música motivadora',
      'Ambiente energético',
      'Instructores certificados'
    ],
    order: 4
  },
  {
    name: 'Zumba',
    price: '420',
    period: '12 clases',
    description: 'Baila, diviértete y ponte en forma',
    features: [
      '1 clase: $45',
      '3 clases: $120',
      '6 clases: $240',
      '12 clases: $420',
      '2x1 este mes'
    ],
    popular: false,
    color: 'pink',
    icon: '💃',
    benefits: [
      'Quema calorías bailando',
      'Mejora coordinación',
      'Reduce estrés',
      'Ambiente divertido'
    ],
    order: 5
  },
  {
    name: 'Funcional Kids',
    price: '500',
    period: '/mes',
    description: 'Diversión y ejercicio para los más pequeños',
    features: [
      'Clase individual: $85',
      'Mensual: $500',
      'Edades: 6-11 años',
      '100% lúdico y seguro',
      'Desarrollo motor integral'
    ],
    popular: false,
    color: 'green',
    icon: '👶',
    benefits: [
      'Desarrollo físico saludable',
      'Fomenta disciplina',
      'Socialización',
      'Instructores especializados'
    ],
    order: 6
  },
  {
    name: 'Salsa y Cumbia',
    price: '450',
    period: '12 clases',
    description: 'Aprende a bailar mientras te ejercitas',
    features: [
      '1 clase: $50',
      '4 clases: $180',
      '8 clases: $320',
      '12 clases: $450',
      'Sin nivel previo necesario'
    ],
    popular: false,
    color: 'yellow',
    icon: '🕺',
    benefits: [
      'Aprende ritmos latinos',
      'Cardio divertido',
      'Mejora ritmo y coordinación',
      'Conoce gente nueva'
    ],
    order: 7
  },
  {
    name: 'Flexibilidad y Movilidad',
    price: '600',
    period: '/mes',
    description: 'Mejora tu rango de movimiento y previene lesiones',
    features: [
      'Clase individual: $70',
      'Mensual: $600',
      'Sesiones especializadas',
      'Ideal para complementar otros entrenamientos',
      'Clase muestra: $35'
    ],
    popular: false,
    color: 'teal',
    icon: '🧘',
    benefits: [
      'Previene lesiones',
      'Mejora postura',
      'Reduce dolor muscular',
      'Relaja y estira'
    ],
    order: 8
  },
  {
    name: 'AVC Competición',
    price: '850',
    period: '/mes',
    description: 'Para atletas que buscan llevar su rendimiento al siguiente nivel',
    features: [
      'Acceso exclusivo a Zona de Programación',
      'Programación personalizada',
      'Sin clases grupales incluidas',
      'Seguimiento de coach',
      'Preparación para competencias'
    ],
    popular: false,
    color: 'gold',
    icon: '🥇',
    benefits: [
      'Entrenamiento competitivo',
      'Programación especializada',
      'Análisis de rendimiento',
      'Preparación profesional'
    ],
    order: 9
  }
];

async function addPlanes() {
  try {
    console.log('🚀 Iniciando proceso de carga de planes...\n');
    
    for (const plan of planes) {
      const docRef = await addDoc(collection(db, 'planes'), {
        ...plan,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      });
      console.log(`✅ Plan "${plan.name}" agregado con ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 ¡Todos los planes han sido agregados exitosamente!');
    console.log(`📊 Total de planes agregados: ${planes.length}`);
    
  } catch (error) {
    console.error('❌ Error al agregar planes:', error);
  }
}

addPlanes();
