# 🔐 Sistema de Autenticación y Panel de Administración

## Configuración Inicial

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** > **Sign-in method** > **Email/Password**
4. Habilita **Firestore Database** en modo de producción

### 2. Obtener Credenciales de Firebase

1. En Firebase Console, ve a **Project Settings** (⚙️)
2. En la sección **General**, busca "Your apps"
3. Si no tienes una app web, haz clic en el ícono `</>`
4. Copia las credenciales de configuración

### 3. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y reemplaza los valores con tus credenciales de Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```

### 4. Crear Usuario Administrador

Una vez configuradas las variables de entorno, ejecuta:

```bash
npm run create-admin
```

El script te pedirá:
- 📧 Email del administrador
- 🔑 Contraseña (mínimo 6 caracteres)
- 🔑 Confirmación de contraseña
- 👤 Nombre completo

Ejemplo:
```
📧 Email del administrador: admin@avcfitness.com
🔑 Contraseña (mínimo 6 caracteres): Admin123!
🔑 Confirmar contraseña: Admin123!
👤 Nombre completo del administrador: Administrador AVC
```

## Uso del Sistema

### Iniciar Sesión

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a [http://localhost:3000/login](http://localhost:3000/login)

3. Ingresa las credenciales del administrador que creaste

### Panel de Administración

Una vez autenticado, serás redirigido a `/admin` donde podrás:

- ✅ **Inicio** - Configurar página principal
- ✅ **Quiénes Somos** - Editar misión, visión, valores
- ✅ **Clases** - Administrar clases y actividades (CRUD completo)
- ✅ **Coaches** - Gestionar entrenadores
- ✅ **Horarios** - Configurar horarios y planes
- ✅ **Testimonios** - Administrar testimonios de clientes
- ✅ **Blog** - Crear y editar artículos
- ✅ **Eventos** - Gestionar eventos especiales
- ✅ **Beneficios** - Configurar promociones
- ✅ **Redes Sociales** - Administrar feeds sociales
- ✅ **Contacto** - Ver mensajes recibidos
- ✅ **Configuración General** - Ajustes globales

### Ejemplo: Administrar Clases

La página `/admin/clases` te permite:
- ➕ Crear nuevas clases
- ✏️ Editar clases existentes
- 🗑️ Eliminar clases
- 📝 Configurar: nombre, descripción, precio, promociones, imágenes, etc.

## Estructura de Firebase

### Collections en Firestore:

```
/admins
  /{uid}
    - email: string
    - fullName: string
    - role: "admin"
    - createdAt: timestamp
    - permissions: object

/clases
  /{id}
    - name: string
    - description: string
    - target: string
    - benefits: string
    - price: string
    - promo: string (opcional)
    - image: string (URL)
    - freeTrial: boolean
    - trialPrice: string (opcional)
    - createdAt: timestamp

/coaches
  /{id}
    - name: string
    - specialty: string
    - bio: string
    - imageUrl: string
    - certifications: array

/testimonials
  /{id}
    - name: string
    - memberSince: string
    - testimonial: string
    - image: string
    - rating: number
```

## Seguridad

### Reglas de Firestore Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función para verificar si el usuario es admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Solo administradores pueden modificar datos
    match /clases/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /coaches/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /testimonials/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /admins/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

## Solución de Problemas

### Error: "Firebase not configured"
- Verifica que el archivo `.env.local` existe
- Confirma que todas las variables comienzan con `NEXT_PUBLIC_`
- Reinicia el servidor de desarrollo después de cambiar `.env.local`

### Error: "Email already in use"
- Este email ya está registrado en Firebase Auth
- Usa otro email o elimina el usuario existente desde Firebase Console

### Error: "Permission denied"
- Configura las reglas de seguridad en Firestore
- Asegúrate de que el usuario esté en la colección `/admins`

## Siguientes Pasos

- [ ] Crear páginas de administración para cada sección
- [ ] Implementar upload de imágenes a Firebase Storage
- [ ] Agregar validación de permisos por rol
- [ ] Implementar recuperación de contraseña
- [ ] Agregar logs de auditoría
- [ ] Crear dashboard con estadísticas

## Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run create-admin # Crear usuario administrador
npm run seed         # Poblar Firestore con datos de ejemplo
```
