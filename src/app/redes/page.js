'use client';
import Image from 'next/image';
import { useEffect } from 'react';

// Configuración de redes sociales
const REDES_SOCIALES = {
  instagram: {
    name: 'Instagram',
    handle: '@avcfitnesscenter',
    url: 'https://www.instagram.com/avcfitnesscenter/',
    embedUrl: 'https://www.instagram.com/avcfitnesscenter/embed',
  },
  facebook: {
    name: 'Facebook',
    handle: 'AVC Fitness Center',
    url: 'https://www.facebook.com/profile.php?id=61580500930578',
    pageId: '61580500930578',
  },
  tiktok: {
    name: 'TikTok',
    handle: '@avcfitness',
    url: 'https://www.tiktok.com/@avcfitness',
  },
};

export default function RedesPage() {
  useEffect(() => {
    // Cargar script de Instagram
    const instagramScript = document.createElement('script');
    instagramScript.src = '//www.instagram.com/embed.js';
    instagramScript.async = true;
    document.body.appendChild(instagramScript);

    // Cargar SDK de Facebook
    const facebookScript = document.createElement('script');
    facebookScript.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v18.0';
    facebookScript.async = true;
    facebookScript.defer = true;
    facebookScript.crossOrigin = 'anonymous';
    document.body.appendChild(facebookScript);

    // Inicializar Facebook SDK
    window.fbAsyncInit = function() {
      if (window.FB) {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      }
    };

    return () => {
      // Cleanup
      if (instagramScript.parentNode) {
        instagramScript.parentNode.removeChild(instagramScript);
      }
      if (facebookScript.parentNode) {
        facebookScript.parentNode.removeChild(facebookScript);
      }
    };
  }, []);

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x600/2a2a2a/333333?text=Comunidad+AVC"
            alt="Comunidad y Redes Sociales"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Nuestra <span className="text-avc-red">Comunidad</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Síguenos en redes sociales y sé parte de la familia AVC
          </p>
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6">
            <a
              href={REDES_SOCIALES.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-avc-red transition duration-300"
              aria-label="Instagram"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={REDES_SOCIALES.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-avc-red transition duration-300"
              aria-label="Facebook"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={REDES_SOCIALES.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-avc-red transition duration-300"
              aria-label="TikTok"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL WALL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestras <span className="text-avc-red">Redes Sociales</span>
            </h2>
            <p className="text-lg text-gray-700">
              Síguenos y mantente al día con nuestra comunidad
            </p>
          </div>

          {/* Grid de Redes Sociales con Embeds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* Instagram Feed */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Instagram</h3>
                    <p className="text-sm text-gray-600">{REDES_SOCIALES.instagram.handle}</p>
                  </div>
                </div>
                <a
                  href={REDES_SOCIALES.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 font-semibold"
                >
                  Seguir
                </a>
              </div>
              
              <div className="relative overflow-hidden rounded-lg bg-white" style={{ minHeight: '600px' }}>
                {/* Instagram Embed - Widget oficial */}
                <iframe
                  src="https://www.instagram.com/avcfitnesscenter/embed"
                  className="w-full"
                  style={{ border: 'none', overflow: 'hidden', minHeight: '600px' }}
                  scrolling="no"
                  frameBorder="0"
                  allowTransparency="true"
                  allow="encrypted-media"
                />
              </div>
              
              <div className="mt-4 text-center">
                <a
                  href={REDES_SOCIALES.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-avc-red hover:text-red-700 font-semibold inline-flex items-center"
                >
                  Ver más en Instagram
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Facebook Feed */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">Facebook</h3>
                    <p className="text-sm text-gray-600">{REDES_SOCIALES.facebook.handle}</p>
                  </div>
                </div>
                <a
                  href={REDES_SOCIALES.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                >
                  Seguir
                </a>
              </div>
              
              <div className="relative overflow-hidden rounded-lg bg-white" style={{ minHeight: '600px' }}>
                {/* Facebook Page Plugin - Widget oficial */}
                <div id="fb-root"></div>
                <div 
                  className="fb-page" 
                  data-href={REDES_SOCIALES.facebook.url}
                  data-tabs="timeline"
                  data-width="500"
                  data-height="600"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite={REDES_SOCIALES.facebook.url} className="fb-xfbml-parse-ignore">
                    <a href={REDES_SOCIALES.facebook.url}>AVC Fitness Center</a>
                  </blockquote>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <a
                  href={REDES_SOCIALES.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-avc-red hover:text-red-700 font-semibold inline-flex items-center"
                >
                  Ver más en Facebook
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* TikTok Section - Sin embed oficial disponible */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">TikTok</h3>
                  <p className="text-gray-600">{REDES_SOCIALES.tiktok.handle}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Mira nuestros videos más épicos, tutoriales y momentos divertidos
              </p>
              <a
                href={REDES_SOCIALES.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-300 font-semibold"
              >
                Ver en TikTok
              </a>
            </div>
          </div>

          {/* CTA Final */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para unirte a nuestra comunidad?
            </h3>
            <p className="text-gray-700 mb-8">
              Síguenos en todas nuestras redes y sé parte de la familia AVC Fitness
            </p>
            <a
              href="/unete"
              className="inline-block px-8 py-4 bg-avc-red text-white rounded-lg hover:bg-red-700 transition duration-300 font-bold text-lg"
            >
              Únete Ahora
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
