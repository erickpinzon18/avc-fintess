import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto text-center px-6">
        <p>&copy; {currentYear} AVC Fitness. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <Link href="/privacidad" className="hover:text-avc-red transition duration-300">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-avc-red transition duration-300">
            Términos
          </Link>
          <Link href="/contacto" className="hover:text-avc-red transition duration-300">
            Contacto
          </Link>
        </div>

        {/* Iconos de Redes Sociales */}
        <div className="flex justify-center space-x-6 mt-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gray-400 hover:text-avc-red transition duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-400 hover:text-avc-red transition duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.62c-3.144 0-3.493.012-4.71.069-2.731.123-3.95 1.349-4.072 4.072-.057 1.217-.069 1.566-.069 4.71s.012 3.493.069 4.71c.123 2.723 1.341 3.949 4.072 4.072 1.217.057 1.566.069 4.71.069 3.144 0 3.493-.012 4.71-.069 2.731-.123 3.95-1.349 4.072-4.072.057-1.217.069-1.566.069-4.71s-.012-3.493-.069-4.71c-.123-2.723-1.341-3.949-4.072-4.072-1.217-.057-1.566-.069-4.71-.069zm0 5.188c-1.954 0-3.52 1.566-3.52 3.52s1.566 3.52 3.52 3.52 3.52-1.566 3.52-3.52-1.566-3.52-3.52-3.52zm0 5.4c-1.038 0-1.88-.842-1.88-1.88s.842-1.88 1.88-1.88 1.88.842 1.88 1.88-.842 1.88-1.88 1.88zm5.225-5.71c-.552 0-.999.447-.999.999s.447.999.999.999c.553 0 .999-.447.999-.999s-.447-.999-.999-.999z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-gray-400 hover:text-avc-red transition duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.001 2.002C6.478 2.002 2 6.48 2 12.003c0 5.522 4.478 10 10.001 10 1.706 0 3.32-.422 4.77-1.193l3.602 1.187-1.165-3.503c.83-1.423 1.31-3.02 1.31-4.723 0-5.523-4.478-10.001-10.001-10.001m0 1.638c4.603 0 8.364 3.76 8.364 8.363 0 1.62-.46 3.14-1.274 4.432l.87 2.61-2.637-.872c-1.27.77-2.753 1.222-4.323 1.222-4.603 0-8.364-3.76-8.364-8.363 0-4.603 3.76-8.363 8.364-8.363m5.01 6.01c-.273-.136-1.62-.798-1.872-.888-.252-.09-.434-.136-.617.136-.183.273-.708.888-.87 1.06-.162.173-.324.195-.6.06-.273-.136-1.144-.422-2.18-1.34-.806-.71-1.34-1.59-1.497-1.864-.16-.273-.015-.42.12-.555.12-.12.273-.324.41-.485.136-.162.183-.273.273-.455.09-.183.045-.346-.022-.482-.067-.136-.617-1.488-.844-2.036-.225-.548-.455-.47-.617-.477-.16-.007-.345-.007-.527-.007-.183 0-.48.068-.732.346-.252.273-.96 1.118-.96 2.71 0 1.59.984 3.14 1.123 3.355.136.213 1.95 2.978 4.728 4.18.66.29 1.173.468 1.575.6.53.183 1.002.158 1.383.09.43-.067 1.27-.518 1.45-.998.18-.48.18-.888.12-.998-.06-.108-.24-.16-.51-.295" />
            </svg>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-gray-400 hover:text-avc-red transition duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
