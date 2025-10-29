import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

async function getEvents() {
  try {
    const eventsCol = collection(db, 'events');
    const q = query(eventsCol, orderBy('date', 'desc'));
    const eventSnapshot = await getDocs(q);
    const eventsList = eventSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const now = new Date();
    const upcoming = eventsList.filter(
      (e) => new Date(e.date?.seconds * 1000 || e.date) >= now
    );
    const past = eventsList.filter((e) => new Date(e.date?.seconds * 1000 || e.date) < now);

    return { upcoming, past };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { upcoming: [], past: [] };
  }
}

export default async function EventosPage() {
  const { upcoming, past } = await getEvents();

  const defaultUpcoming = [
    {
      id: '1',
      title: 'Open de CrossFit 2025',
      date: new Date('2025-02-15'),
      description: 'Participa en el evento más grande de CrossFit del año',
      imageUrl: 'https://placehold.co/800x400/dc2626/white?text=Open+2025',
      location: 'AVC Fitness Center',
    },
    {
      id: '2',
      title: 'Workshop de Halterofilia',
      date: new Date('2025-01-20'),
      description: 'Mejora tu técnica con expertos internacionales',
      imageUrl: 'https://placehold.co/800x400/1a1a1a/white?text=Workshop',
      location: 'AVC Fitness Center',
    },
  ];

  const defaultPast = [
    {
      id: '3',
      title: 'AVC Throwdown 2024',
      date: new Date('2024-12-10'),
      description: 'Competencia interna épica',
      imageUrl: 'https://placehold.co/800x400/333333/white?text=Throwdown',
      location: 'AVC Fitness Center',
    },
  ];

  const displayUpcoming = upcoming.length > 0 ? upcoming : defaultUpcoming;
  const displayPast = past.length > 0 ? past : defaultPast;

  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/dc2626/333333?text=Eventos+AVC"
            alt="Eventos"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Eventos <span className="text-avc-red">AVC</span>
          </h1>
          <p className="text-xl text-gray-200">
            Competencias, workshops y actividades especiales para toda la comunidad
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">
            Próximos <span className="text-avc-red">Eventos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {displayUpcoming.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-avc-red"
              >
                <div className="relative h-64">
                  <Image
                    src={event.imageUrl || 'https://placehold.co/800x400/333333/white?text=Event'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-avc-red font-semibold mb-2">
                    {new Date(event.date?.seconds * 1000 || event.date).toLocaleDateString(
                      'es-ES',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>
                  <p className="text-gray-500 text-sm">📍 {event.location}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white mb-12">
            Eventos <span className="text-avc-red">Pasados</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPast.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-xl overflow-hidden opacity-75">
                <div className="relative h-48">
                  <Image
                    src={event.imageUrl || 'https://placehold.co/800x400/333333/white?text=Event'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(event.date?.seconds * 1000 || event.date).toLocaleDateString(
                      'es-ES'
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
