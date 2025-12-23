import { Metadata } from 'next';
import HorariosPage from './HorariosPage.js';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

interface WOD {
  id: string;
  titulo: string;
  modalidad: string;
  timeCap?: string;
  tipo: string;
  fechaString: string;
  ejercicios?: Array<{
    nombre: string;
    cantidad: string;
    peso?: string;
  }>;
  notas?: string;
}

interface Clase {
  id: string;
  clase: string;
  instructor?: string;
  horaInicio: string;
  horaFin?: string;
  fecha?: any;
  tipo?: string;
}

async function getScheduleMetadata() {
  try {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date();
    const todayName = days[today.getDay()];
    
    // Obtener clases del día
    const horariosSnapshot = await getDocs(collection(db, 'calendario'));
    const clasesHoy = horariosSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Clase))
      .filter((h) => {
        if (h.tipo === 'wod' || !h.clase) return false;
        const fecha = h.fecha?.toDate();
        if (!fecha) return false;
        return days[fecha.getDay()] === todayName;
      })
      .sort((a, b) => {
        const [horaA] = (a.horaInicio || '').split(':').map(Number);
        const [horaB] = (b.horaInicio || '').split(':').map(Number);
        return horaA - horaB;
      });

    // Obtener WOD del día
    const todayString = today.toISOString().split('T')[0];
    const wodsSnapshot = await getDocs(
      query(collection(db, 'calendario'), where('fechaString', '==', todayString))
    );
    
    const wod = wodsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as WOD))
      .find((w) => w.tipo === 'wod');

    return { clasesHoy, wod, todayName };
  } catch (error) {
    console.error('Error loading metadata:', error);
    return { clasesHoy: [], wod: null, todayName: 'Hoy' };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { clasesHoy, wod, todayName } = await getScheduleMetadata();
  
  // Generar descripción dinámica
  let description = `Horarios y membresías de AVC Fitness. `;
  
  if (clasesHoy.length > 0) {
    const clasesNombres = [...new Set(clasesHoy.map((c) => c.clase))].slice(0, 3);
    description += `${todayName}: ${clasesNombres.join(', ')}`;
    if (clasesHoy.length > 3) {
      description += ` y ${clasesHoy.length - clasesNombres.length} clases más`;
    }
    description += '. ';
  }
  
  if (wod) {
    description += `WOD: ${wod.titulo} - ${wod.modalidad}. `;
  }
  
  description += 'Planes desde $800/mes. Sin permanencia. Clase gratis.';

  // Generar título dinámico
  let title = 'Horarios y Membresías - AVC Fitness';
  if (clasesHoy.length > 0) {
    title = `${todayName}: ${clasesHoy.length} Clases Disponibles | AVC Fitness`;
  }

  // Generar resumen para compartir
  let ogDescription = description;
  if (wod && clasesHoy.length > 0) {
    ogDescription = `🔥 ${todayName}\n\n`;
    ogDescription += `📅 ${clasesHoy.length} clases: ${clasesHoy.slice(0, 3).map((c) => 
      `${c.clase} ${c.horaInicio}`
    ).join(', ')}\n\n`;
    ogDescription += `💪 WOD: ${wod.titulo} (${wod.modalidad})`;
    if (wod.timeCap) {
      ogDescription += ` - ${wod.timeCap} min`;
    }
  }

  return {
    title,
    description,
    keywords: [
      'horarios AVC Fitness',
      'clases CrossFit Querétaro',
      'membresías gym Querétaro',
      'WOD del día',
      'horarios gimnasio',
      'planes fitness',
      'CrossFit schedule',
      'funcional Querétaro',
      'clases grupales',
      todayName
    ],
    openGraph: {
      title,
      description: ogDescription,
      type: 'website',
      locale: 'es_MX',
      url: 'https://avcfitness.com/horarios',
      siteName: 'AVC Fitness',
      images: [
        {
          url: '/assets/logo-completo.png',
          width: 1200,
          height: 630,
          alt: `AVC Fitness - Horarios ${todayName}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: ogDescription,
      images: ['/assets/logo-completo.png']
    },
    alternates: {
      canonical: 'https://avcfitness.com/horarios'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: ogDescription,
        url: 'https://avcfitness.com/horarios',
        mainEntity: {
          '@type': 'Schedule',
          name: `Horarios de ${todayName}`,
          description: `Clases disponibles para ${todayName}`,
          ...(clasesHoy.length > 0 && {
            event: clasesHoy.map((clase) => ({
              '@type': 'Event',
              name: clase.clase,
              startDate: `${new Date().toISOString().split('T')[0]}T${clase.horaInicio}:00`,
              ...(clase.horaFin && {
                endDate: `${new Date().toISOString().split('T')[0]}T${clase.horaFin}:00`
              }),
              location: {
                '@type': 'Place',
                name: 'AVC Fitness'
              },
              organizer: {
                '@type': 'Organization',
                name: 'AVC Fitness'
              }
            }))
          })
        },
        ...(wod && {
          about: {
            '@type': 'ExercisePlan',
            name: wod.titulo,
            description: wod.modalidad,
            exerciseType: 'CrossFit'
          }
        })
      })
    }
  };
}

export default HorariosPage;
