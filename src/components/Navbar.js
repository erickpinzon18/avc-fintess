'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/quienes-somos', label: 'Quiénes Somos' },
    { href: '/clases', label: 'Clases' },
    { href: '/coaches', label: 'Coaches' },
    { href: '/horarios', label: 'Horarios' },
    { href: '/testimonios', label: 'Testimonios' },
    { href: '/eventos', label: 'Eventos' },
    { href: '/beneficios', label: 'Beneficios' },
    { href: '/galeria', label: 'Galería' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/dudas', label: 'Dudas' },
    { href: '/blog', label: 'Blog' },
    { href: '/redes', label: 'Comunidad' },
    { href: '/unete', label: 'Únete' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 fixed w-full z-50 shadow-lg top-0">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y Nombre */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/assets/logo.svg"
            alt="Logo AVC Fitness Center"
            width={40}
            height={40}
            className="navbar-logo"
          />
          <span className="text-white text-2xl font-bold tracking-tight">
            AVC Fitness Center
          </span>
        </Link>

        {/* Links de Navegación (para Desktop) */}
        <div className="hidden lg:flex space-x-6">
          {navLinks.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition duration-300 ${
                isActive(link.href)
                  ? 'text-avc-red'
                  : 'text-white hover:text-avc-red'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Dropdown Menu para más opciones */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="text-white hover:text-avc-red transition duration-300 flex items-center">
                Más
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  {navLinks.slice(6).map((link) => (
                    <Menu.Item key={link.href}>
                      {({ active }) => (
                        <Link
                          href={link.href}
                          className={`${
                            active || isActive(link.href)
                              ? 'bg-gray-700 text-avc-red'
                              : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm transition duration-150`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Botón de Menú (para Móvil) */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="lg:hidden mt-4 bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`transition duration-300 px-3 py-2 rounded ${
                  isActive(link.href)
                    ? 'text-avc-red bg-gray-700'
                    : 'text-white hover:text-avc-red hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Transition>
    </nav>
  );
}
