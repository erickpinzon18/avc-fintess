// Script para crear un usuario administrador en Firebase
// Ejecutar con: node scripts/createAdmin.js

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as readline from 'readline';

// Cargar variables de entorno desde .env.local
config({ path: '.env.local' });

// Configuración de Firebase (usa las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

// Verificar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey) {
  console.error('❌ Error: Las variables de entorno de Firebase no están configuradas.');
  console.log('Por favor, crea un archivo .env.local con las credenciales de Firebase.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Crear interfaz para leer input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  console.log('\n🔐 Creación de Usuario Administrador para AVC Fitness Center\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Solicitar email
    const email = await question('📧 Email del administrador: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Email inválido');
      rl.close();
      return;
    }

    // Solicitar contraseña
    const password = await question('🔑 Contraseña (mínimo 6 caracteres): ');
    if (!password || password.length < 6) {
      console.log('❌ La contraseña debe tener al menos 6 caracteres');
      rl.close();
      return;
    }

    // Confirmar contraseña
    const confirmPassword = await question('🔑 Confirmar contraseña: ');
    if (password !== confirmPassword) {
      console.log('❌ Las contraseñas no coinciden');
      rl.close();
      return;
    }

    // Solicitar nombre completo
    const fullName = await question('👤 Nombre completo del administrador: ');

    console.log('\n⏳ Creando usuario administrador...\n');

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Usuario creado en Firebase Authentication');
    console.log(`   UID: ${user.uid}`);

    // Guardar información adicional en Firestore
    await setDoc(doc(db, 'admins', user.uid), {
      email: email,
      fullName: fullName,
      role: 'admin',
      createdAt: new Date(),
      permissions: {
        clases: true,
        coaches: true,
        horarios: true,
        testimonios: true,
        blog: true,
        eventos: true,
        beneficios: true,
        redes: true,
        contacto: true,
        configuracion: true,
      },
    });

    console.log('✅ Perfil de administrador guardado en Firestore');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✨ ¡Usuario administrador creado exitosamente! ✨');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📋 Detalles del administrador:');
    console.log(`   Email: ${email}`);
    console.log(`   Nombre: ${fullName}`);
    console.log(`   UID: ${user.uid}`);
    console.log('\n🔗 Ahora puedes iniciar sesión en: http://localhost:3000/login\n');

  } catch (error) {
    console.error('\n❌ Error al crear el usuario administrador:');
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('   Este email ya está registrado.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('   El formato del email es inválido.');
    } else if (error.code === 'auth/weak-password') {
      console.log('   La contraseña es muy débil.');
    } else {
      console.log(`   ${error.message}`);
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Ejecutar el script
createAdminUser();
