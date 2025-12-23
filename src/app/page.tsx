import { Metadata } from 'next';
import HomePage from './HomePage.js';

export const metadata: Metadata = {
  title: 'AVC Fitness - Tu Casa Fitness | CrossFit, Funcional y Halterofilia en Querétaro',
  description: 'Únete a AVC Fitness, tu casa fitness en Querétaro. CrossFit, Funcional, Halterofilia y más. Ambiente familiar, coaches capacitados y comunidad activa. ¡Clase gratis de prueba! Sin permanencia.',
  keywords: [
    'CrossFit Querétaro',
    'gimnasio Querétaro',
    'funcional Querétaro',
    'halterofilia',
    'fitness Querétaro',
    'AVC Fitness',
    'clases grupales',
    'entrenamiento funcional',
    'box CrossFit',
    'comunidad fitness'
  ],
  openGraph: {
    title: 'AVC Fitness - Tu Casa Fitness',
    description: 'Supera tus límites en AVC Fitness. CrossFit, Funcional, Halterofilia y más. Únete a nuestra comunidad fitness.',
    type: 'website',
    locale: 'es_MX',
    url: 'https://avcfitness.com',
    siteName: 'AVC Fitness',
    images: [
      {
        url: '/assets/logo-completo.png',
        width: 1200,
        height: 630,
        alt: 'AVC Fitness - Tu Casa Fitness'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVC Fitness - Tu Casa Fitness',
    description: 'Supera tus límites. CrossFit, Funcional, Halterofilia y más. Únete a nuestra comunidad fitness.',
    images: ['/assets/logo-completo.png']
  },
  alternates: {
    canonical: 'https://avcfitness.com'
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
      '@type': 'GymOrHealthClub',
      name: 'AVC Fitness',
      description: 'Tu casa fitness en Querétaro. CrossFit, Funcional, Halterofilia y más.',
      url: 'https://avcfitness.com',
      logo: 'https://avcfitness.com/assets/logo-completo.png',
      image: 'https://avcfitness.com/assets/logo-completo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Querétaro',
        addressRegion: 'QRO',
        addressCountry: 'MX'
      },
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '06:00',
          closes: '22:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '14:00'
        }
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Membresías',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CrossFit',
              description: 'Entrenamiento funcional de alta intensidad'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Funcional',
              description: 'Entrenamiento funcional para todos los niveles'
            }
          }
        ]
      }
    })
  }
};

export default HomePage;
