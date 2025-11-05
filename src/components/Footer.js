import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-600 py-12 border-t border-gray-200">
      <div className="container mx-auto text-center px-6">
        <p className="text-gray-700 font-medium">&copy; {currentYear} AVC Fitness. Todos los derechos reservados.</p>
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
            className="text-gray-600 hover:text-avc-red transition duration-300"
          >
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-600 hover:text-avc-red transition duration-300"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-gray-600 hover:text-avc-red transition duration-300"
          >
            <FaWhatsapp className="w-6 h-6" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-gray-600 hover:text-avc-red transition duration-300"
          >
            <FaTiktok className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
