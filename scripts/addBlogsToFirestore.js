import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogPosts = [
  {
    title: 'Los 5 Mitos Más Comunes sobre la Proteína y el CrossFit',
    slug: 'mitos-proteina-crossfit',
    excerpt: 'Descubre la verdad sobre la proteína y desmiente los mitos más comunes en el mundo del fitness.',
    content: `
      <p>El mundo del fitness, y especialmente el del CrossFit, está lleno de información. A veces, es difícil separar la realidad de la ficción, sobre todo cuando hablamos de nutrición. La proteína es, sin duda, el macronutriente más debatido. ¿Realmente necesitas ese batido post-entreno? ¿Comer "demasiada" proteína es malo?</p>
      
      <p>Vamos a desmentir los 5 mitos más comunes que escuchamos en el box para que puedas tomar decisiones informadas sobre tu alimentación y optimizar tu recuperación.</p>
      
      <h2>Mito 1: "Necesitas un batido de proteína INMEDIATAMENTE después de entrenar"</h2>
      <p>La famosa "ventana anabólica". Si bien es cierto que tu cuerpo está receptivo a los nutrientes después de un WOD intenso, la urgencia no es tan dramática como se piensa. Los estudios demuestran que la ingesta total de proteína a lo largo del día es mucho más importante que el timing exacto. Si comes una comida rica en proteínas 1-2 horas antes de entrenar y otra 1-2 horas después, probablemente estés cubierto. El batido es una herramienta de conveniencia, no una regla mágica.</p>

      <h2>Mito 2: "Comer mucha proteína daña los riñones"</h2>
      <p>Este es un mito persistente. En individuos sanos (es decir, sin enfermedad renal preexistente), no hay evidencia científica sólida que demuestre que una dieta alta en proteínas cause daño renal. Los riñones están diseñados para filtrar los subproductos del metabolismo de las proteínas. Si tienes una condición médica, debes consultar a tu médico, pero para el atleta promedio, consumir una cantidad adecuada (ej. 1.6-2.2g por kg de peso) es seguro.</p>

      <blockquote>"La proteína es una herramienta de conveniencia, no una regla mágica. Tu ingesta total diaria es lo que realmente importa."</blockquote>

      <h2>Mito 3: "Solo puedes absorber 30g de proteína por comida"</h2>
      <p>Falso. El cuerpo puede absorber casi toda la proteína que le des. La pregunta real es cuánta puede utilizar para la síntesis de proteínas musculares (construcción de músculo) en un momento dado. Aunque el pico de síntesis puede estar alrededor de 25-35g, el resto de la proteína no se desperdicia; se oxida para obtener energía o se utiliza para otros procesos corporales. Es mejor distribuir tu ingesta en 3-5 comidas al día, pero no te estreses si una comida tiene 50g.</p>
      
      <h2>Mito 4: "Las dietas altas en proteína te hacen engordar"</h2>
      <p>Ningún macronutriente por sí solo te hace engordar. El aumento de peso se debe a un superávit calórico (comer más calorías de las que quemas). De hecho, la proteína es el macronutriente más saciante, lo que significa que te ayuda a sentirte lleno por más tiempo, pudiendo ayudar en la pérdida de grasa.</p>
      
      <h2>Mito 5: "Las fuentes de proteína vegetal son inferiores"</h2>
      <ul>
        <li>Las proteínas vegetales (lentejas, garbanzos, tofu, etc.) pueden ser ligeramente menos biodisponibles que las animales.</li>
        <li>A algunas les falta uno o más aminoácidos esenciales (son "incompletas").</li>
        <li>Sin embargo, esto se soluciona fácilmente comiendo una variedad de fuentes vegetales a lo largo del día (ej. arroz y frijoles).</li>
        <li>Para atletas veganos o vegetarianos, simplemente se recomienda aumentar ligeramente la ingesta total de proteína para compensar.</li>
      </ul>
      
      <p>En conclusión, la proteína es tu aliada número uno para la recuperación y la adaptación al entrenamiento. No temas incluirla en cada comida y enfócate en la calidad y la cantidad total diaria, en lugar de preocuparte por mitos obsoletos.</p>
    `,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    category: 'Nutrición',
    author: 'Ana Rodríguez',
    published: true,
    featured: true,
    publishedAt: new Date('2025-10-28'),
    createdAt: new Date(),
  },
  {
    title: '5 Beneficios del CrossFit que no conocías',
    slug: 'beneficios-crossfit',
    excerpt: 'Descubre cómo el CrossFit puede transformar no solo tu cuerpo, sino también tu mentalidad y estilo de vida.',
    content: `
      <p>El CrossFit es mucho más que levantar pesas y hacer ejercicios intensos. Es un estilo de vida que transforma tu cuerpo, mente y espíritu. Aquí te presentamos 5 beneficios que quizás no conocías.</p>
      
      <h2>1. Mejora tu salud cardiovascular</h2>
      <p>Los WODs de alta intensidad mejoran significativamente tu capacidad cardiovascular y resistencia.</p>
      
      <h2>2. Construye una comunidad fuerte</h2>
      <p>En el box, no solo encuentras compañeros de entrenamiento, sino una familia que te apoya en cada paso.</p>
      
      <h2>3. Aumenta tu confianza</h2>
      <p>Cada PR (Personal Record) que logras te hace sentir más capaz y seguro de ti mismo.</p>
      
      <h2>4. Desarrolla disciplina</h2>
      <p>El compromiso constante con tus entrenamientos se traduce en disciplina para otras áreas de tu vida.</p>
      
      <h2>5. Mejora tu salud mental</h2>
      <p>El ejercicio libera endorfinas que te ayudan a manejar el estrés y la ansiedad de manera natural.</p>
    `,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'Entrenamiento',
    author: 'Carlos Mendoza',
    published: true,
    featured: false,
    publishedAt: new Date('2025-10-15'),
    createdAt: new Date(),
  },
  {
    title: 'Guía de Nutrición para Atletas de CrossFit',
    slug: 'nutricion-para-atletas',
    excerpt: 'Aprende qué comer antes y después del entrenamiento para maximizar tus resultados.',
    content: `
      <p>La nutrición es fundamental para el rendimiento en CrossFit. Aquí te mostramos cómo alimentarte correctamente.</p>
      
      <h2>Antes del entrenamiento</h2>
      <p>Consume carbohidratos de fácil digestión 30-60 minutos antes. Ejemplos: plátano, avena, pan tostado.</p>
      
      <h2>Durante el entrenamiento</h2>
      <p>Mantente hidratado. Para sesiones largas (>60 min), considera bebidas con electrolitos.</p>
      
      <h2>Después del entrenamiento</h2>
      <p>Combina proteínas y carbohidratos para optimizar la recuperación. Ratio ideal: 3:1 o 4:1 carbos:proteína.</p>
      
      <h2>Suplementación</h2>
      <ul>
        <li>Proteína en polvo: Conveniente pero no esencial</li>
        <li>Creatina: Mejora fuerza y potencia</li>
        <li>Omega-3: Reduce inflamación</li>
        <li>Vitamina D: Importante si no te expones al sol</li>
      </ul>
    `,
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800',
    category: 'Nutrición',
    author: 'Ana Rodríguez',
    published: true,
    featured: false,
    publishedAt: new Date('2025-10-10'),
    createdAt: new Date(),
  },
  {
    title: 'Por qué la Movilidad es Clave en tu Entrenamiento',
    slug: 'importancia-movilidad',
    excerpt: 'La flexibilidad y movilidad son fundamentales para prevenir lesiones y mejorar el rendimiento.',
    content: `
      <p>La movilidad es a menudo pasada por alto, pero es crucial para un rendimiento óptimo y prevención de lesiones.</p>
      
      <h2>¿Qué es la movilidad?</h2>
      <p>Es la capacidad de mover una articulación a través de su rango completo de movimiento con control.</p>
      
      <h2>Beneficios de trabajar movilidad</h2>
      <ul>
        <li>Previene lesiones</li>
        <li>Mejora la técnica en movimientos complejos</li>
        <li>Aumenta el rango de movimiento</li>
        <li>Acelera la recuperación</li>
        <li>Mejora el rendimiento general</li>
      </ul>
      
      <h2>Cuándo trabajar movilidad</h2>
      <p>Dedica 10-15 minutos antes del WOD para movilidad dinámica y 10-15 minutos después para estiramientos estáticos.</p>
      
      <blockquote>"La movilidad es el superpoder secreto de los mejores atletas."</blockquote>
    `,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    category: 'Salud',
    author: 'María Sánchez',
    published: true,
    featured: false,
    publishedAt: new Date('2025-10-05'),
    createdAt: new Date(),
  },
  {
    title: 'El Poder de la Comunidad en AVC Fitness',
    slug: 'comunidad-avc',
    excerpt: 'Cómo entrenar en grupo puede multiplicar tus resultados y hacer el proceso más divertido.',
    content: `
      <p>Una de las mayores fortalezas de AVC Fitness es nuestra comunidad increíble. Entrenar junto a otros transforma completamente tu experiencia.</p>
      
      <h2>Motivación colectiva</h2>
      <p>Cuando ves a tus compañeros dar lo mejor de sí, tú también te esfuerzas más. La energía del grupo es contagiosa.</p>
      
      <h2>Responsabilidad</h2>
      <p>Es más difícil faltar al WOD cuando sabes que tu crew te está esperando.</p>
      
      <h2>Aprendizaje compartido</h2>
      <p>Los atletas más experimentados comparten consejos y técnicas que aceleran tu progreso.</p>
      
      <h2>Celebraciones compartidas</h2>
      <p>Cada PR, cada logro, se celebra en comunidad. Tus victorias son victorias de todos.</p>
      
      <blockquote>"Solos vamos más rápido, juntos llegamos más lejos."</blockquote>
    `,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    category: 'Motivación',
    author: 'Luis Gómez',
    published: true,
    featured: false,
    publishedAt: new Date('2025-09-28'),
    createdAt: new Date(),
  },
  {
    title: '¿Qué es el AMRAP y cómo te ayuda?',
    slug: 'que-es-amrap',
    excerpt: 'Entiende este formato de entrenamiento y cómo puede llevar tu rendimiento al siguiente nivel.',
    content: `
      <p>AMRAP significa "As Many Rounds/Reps As Possible" (Tantas Rondas/Repeticiones Como Sea Posible). Es uno de los formatos más populares en CrossFit.</p>
      
      <h2>¿Cómo funciona?</h2>
      <p>Se te da un tiempo fijo (por ejemplo, 10 minutos) y una serie de ejercicios. Tu objetivo es completar tantas rondas o repeticiones como puedas en ese tiempo.</p>
      
      <h2>Ejemplo de AMRAP</h2>
      <p>AMRAP 12 minutos:</p>
      <ul>
        <li>10 Air Squats</li>
        <li>10 Push-ups</li>
        <li>10 Sit-ups</li>
      </ul>
      
      <h2>Beneficios del AMRAP</h2>
      <ul>
        <li>Mejora la resistencia cardiovascular y muscular</li>
        <li>Permite medir el progreso fácilmente (cuentas las rondas)</li>
        <li>Altamente escalable para todos los niveles</li>
        <li>Desarrolla fortaleza mental</li>
        <li>Quema muchas calorías</li>
      </ul>
      
      <h2>Tips para AMRAPs</h2>
      <p>Encuentra un ritmo sostenible. No salgas demasiado rápido o te quedarás sin gas. La consistencia gana.</p>
    `,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    category: 'Entrenamiento',
    author: 'Carlos Mendoza',
    published: true,
    featured: false,
    publishedAt: new Date('2025-09-20'),
    createdAt: new Date(),
  },
];

async function addBlogs() {
  try {
    console.log('🔄 Agregando artículos del blog a Firestore...\n');

    for (const post of blogPosts) {
      const docRef = await addDoc(collection(db, 'blog'), post);
      console.log(`✅ ${post.title} agregado con ID: ${docRef.id}`);
    }

    console.log(`\n🎉 ¡${blogPosts.length} artículos agregados exitosamente!`);
    console.log('📝 Puedes verlos en /admin/blog y /blog');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar artículos:', error);
    process.exit(1);
  }
}

addBlogs();
