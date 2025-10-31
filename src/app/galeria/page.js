'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function GaleriaPage() {
  const galleryRef = useScrollAnimation({ stagger: 0.1 });
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const galeriaCol = collection(db, 'galeria');
      const galeriaSnapshot = await getDocs(galeriaCol);
      const galeriaList = galeriaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por orden
      galeriaList.sort((a, b) => (a.order || 0) - (b.order || 0));
      setGalleryItems(galeriaList);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const filteredItems = filterCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filterCategory);

  const categories = ['all', ...new Set(galleryItems.map(item => item.category))];


  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/dc2626/333333?text=Galeria+AVC"
            alt="Galería"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Tour por <span className="text-avc-red">AVC</span>
          </h1>
          <p className="text-xl text-gray-200">
            Conoce nuestras instalaciones y vive la experiencia AVC
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                  filterCategory === cat
                    ? 'bg-avc-red text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filteredItems.length > 0 ? (
            <div ref={galleryRef} className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id || index} 
                  data-animate 
                  className="gallery-item group cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  {item.type === 'image' || item.type === 'photo' ? (
                    <Image 
                      src={item.url} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-20 h-20 text-avc-red mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white font-semibold">Ver Video</p>
                      </div>
                    </div>
                  )}
                  <div className="gallery-item-overlay">
                    <div className="text-center">
                      <span className="text-lg font-semibold mb-2 block">{item.title}</span>
                      {item.description && (
                        <p className="text-sm text-gray-300">{item.description}</p>
                      )}
                      <span className="inline-block mt-3 text-xs bg-avc-red px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No hay elementos en la galería</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-gray-900 rounded-xl overflow-hidden">
              {selectedItem.type === 'image' || selectedItem.type === 'photo' ? (
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video">
                  <iframe
                    src={selectedItem.url}
                    title={selectedItem.title}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <div className="p-6 bg-gray-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
                    {selectedItem.description && (
                      <p className="text-gray-400 mb-4">{selectedItem.description}</p>
                    )}
                    <span className="inline-block bg-avc-red text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
