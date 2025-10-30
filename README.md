# AVC Fitness - Sitio Web Next.js 🏋️

## Descripción del Proyecto

Sitio web moderno y dinámico para AVC Fitness construido con **Next.js 14 (App Router)**, **Tailwind CSS**, **Firebase** y **GSAP**. Transforma diseños HTML estáticos en una aplicación web completamente funcional con contenido dinámico desde Firestore.

## 🚀 Tecnologías

- Next.js 14 (App Router)
- React 19
- Tailwind CSS 4
- Firebase (Firestore + Auth)
- GSAP (animaciones)
- Framer Motion
- Headless UI

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea `.env.local` en la raíz:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 2. Firestore Collections

Crea estas colecciones en Firebase:

- `coaches` - Información de entrenadores
- `posts` - Posts del blog
- `testimonials` - Testimonios de clientes
- `events` - Eventos próximos y pasados
- `socialPosts` - Posts de redes sociales
- `contacts` - Formulario de contacto
- `feedback` - Dudas y sugerencias
- `newMembers` - Inscripciones

## 🎯 Ejecutar Proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura

```
src/
├── app/              # Páginas (App Router)
├── components/       # Navbar, Footer
├── hooks/            # useScrollAnimation (GSAP)
└── lib/              # firebase.js
```

## 🌐 Páginas del Sitio

- `/` - Inicio
- `/quienes-somos` - Filosofía y valores
- `/clases` - Catálogo de clases
- `/coaches` - Equipo (dinámico)
- `/horarios` - Horarios y membresías
- `/testimonios` - Testimonios (dinámico)
- `/eventos` - Eventos (dinámico)
- `/beneficios` - Beneficios
- `/galeria` - Tour virtual
- `/contacto` - Formulario
- `/dudas` - FAQ
- `/blog` - Blog (dinámico)
- `/blog/[slug]` - Detalle de post
- `/redes` - Comunidad (dinámico)
- `/unete` - Inscripción ⭐

## 🎨 Colores

- Fondo: `#1a1a1a`
- Texto: `#e0e0e0`
- Rojo AVC: `#dc2626`

## 📝 Licencia

Proyecto privado - AVC Fitness
