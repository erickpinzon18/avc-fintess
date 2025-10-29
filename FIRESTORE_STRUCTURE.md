# Estructura de Datos para Firestore - AVC Fitness Center

Este archivo contiene ejemplos de documentos para cada colección de Firestore.

## Colección: `coaches`

```json
{
  "name": "Carlos Mendoza",
  "specialty": "CrossFit L1, Halterofilia",
  "bio": "Apasionado por el fitness con más de 8 años de experiencia. Le encanta motivar y ver el progreso de cada atleta.",
  "imageUrl": "https://placehold.co/400x400/dc2626/white?text=Carlos",
  "createdAt": "Firestore Timestamp"
}

{
  "name": "Ana Rodríguez",
  "specialty": "CrossFit L2, Nutrición",
  "bio": "Especialista en ayudar a principiantes. Combina entrenamiento con consejos nutricionales.",
  "imageUrl": "https://placehold.co/400x400/1a1a1a/white?text=Ana",
  "createdAt": "Firestore Timestamp"
}

{
  "name": "Luis Gómez",
  "specialty": "Halterofilia, Movilidad",
  "bio": "Ex competidor nacional de halterofilia. Perfeccionista de la técnica y gran mentor.",
  "imageUrl": "https://placehold.co/400x400/333333/white?text=Luis",
  "createdAt": "Firestore Timestamp"
}

{
  "name": "María Sánchez",
  "specialty": "Yoga, Funcional",
  "bio": "Instructora certificada de yoga. Aporta equilibrio y consciencia corporal al equipo.",
  "imageUrl": "https://placehold.co/400x400/555555/white?text=Maria",
  "createdAt": "Firestore Timestamp"
}
```

## Colección: `posts`

```json
{
  "slug": "beneficios-crossfit",
  "title": "5 Beneficios del CrossFit que no conocías",
  "excerpt": "Descubre cómo el CrossFit puede transformar no solo tu cuerpo, sino también tu mentalidad y estilo de vida.",
  "content": "<h2>Introducción</h2><p>El CrossFit es mucho más que un entrenamiento físico...</p><h2>1. Mejora la salud cardiovascular</h2><p>Los WODs de alta intensidad...</p><h2>2. Fortalece la comunidad</h2><p>Entrenar en grupo crea lazos...</p><h2>Conclusión</h2><p>El CrossFit ofrece beneficios integrales...</p>",
  "imageUrl": "https://placehold.co/800x400/dc2626/white?text=CrossFit+Benefits",
  "category": "Entrenamiento",
  "publishedAt": "Firestore Timestamp",
  "author": "Carlos Mendoza"
}

{
  "slug": "nutricion-para-atletas",
  "title": "Guía de Nutrición para Atletas de CrossFit",
  "excerpt": "Aprende qué comer antes y después del entrenamiento para maximizar tus resultados.",
  "content": "<h2>La Importancia de la Nutrición</h2><p>Tu rendimiento depende de lo que comes...</p><h2>Pre-Workout</h2><p>Carbohidratos complejos 2-3 horas antes...</p><h2>Post-Workout</h2><p>Proteínas y carbohidratos en los primeros 30 minutos...</p>",
  "imageUrl": "https://placehold.co/800x400/1a1a1a/white?text=Nutrition+Guide",
  "category": "Nutrición",
  "publishedAt": "Firestore Timestamp",
  "author": "Ana Rodríguez"
}
```

## Colección: `testimonials`

```json
{
  "name": "Pedro Martínez",
  "memberSince": "2022",
  "testimonial": "AVC cambió mi vida. No solo mejoré mi condición física, también encontré una familia que me motiva cada día.",
  "imageUrl": "https://placehold.co/200x200/dc2626/white?text=PM",
  "rating": 5,
  "createdAt": "Firestore Timestamp"
}

{
  "name": "Laura Fernández",
  "memberSince": "2021",
  "testimonial": "Los coaches son increíbles. Siempre atentos, motivadores y preocupados por tu técnica y progreso.",
  "imageUrl": "https://placehold.co/200x200/1a1a1a/white?text=LF",
  "rating": 5,
  "createdAt": "Firestore Timestamp"
}

{
  "name": "Javier Ruiz",
  "memberSince": "2023",
  "testimonial": "Llegué sin experiencia y con miedo. Ahora el gimnasio es mi lugar favorito. ¡Gracias AVC!",
  "imageUrl": "https://placehold.co/200x200/333333/white?text=JR",
  "rating": 5,
  "createdAt": "Firestore Timestamp"
}
```

## Colección: `events`

```json
{
  "title": "Open de CrossFit 2025",
  "description": "Participa en el evento más grande de CrossFit del año. Tres WODs, premios increíbles y mucha diversión.",
  "date": "Firestore Timestamp (2025-02-15)",
  "imageUrl": "https://placehold.co/800x400/dc2626/white?text=Open+2025",
  "location": "AVC Fitness Center"
}

{
  "title": "Workshop de Halterofilia",
  "description": "Mejora tu técnica en Snatch y Clean & Jerk con coaches certificados y atletas internacionales.",
  "date": "Firestore Timestamp (2025-01-20)",
  "imageUrl": "https://placehold.co/800x400/1a1a1a/white?text=Workshop",
  "location": "AVC Fitness Center"
}

{
  "title": "AVC Throwdown 2024",
  "description": "Nuestra competencia interna anual. 50+ atletas, 4 WODs épicos.",
  "date": "Firestore Timestamp (2024-12-10)",
  "imageUrl": "https://placehold.co/800x400/333333/white?text=Throwdown",
  "location": "AVC Fitness Center"
}
```

## Colección: `socialPosts`

```json
{
  "type": "instagram",
  "imageUrl": "https://placehold.co/400x400/dc2626/white?text=Instagram+1",
  "caption": "¡WOD épico de hoy! 💪 #AVCFitness #CrossFit",
  "likes": 245,
  "platform": "@avcfitness",
  "createdAt": "Firestore Timestamp"
}

{
  "type": "tiktok",
  "imageUrl": "https://placehold.co/400x600/1a1a1a/white?text=TikTok+Video",
  "caption": "Tutorial: Cómo hacer un Snatch perfecto 🏋️",
  "likes": 1200,
  "platform": "@avcfitness",
  "createdAt": "Firestore Timestamp"
}

{
  "type": "youtube",
  "imageUrl": "https://placehold.co/600x400/555555/white?text=YouTube+Video",
  "caption": "Día en la vida de un atleta AVC",
  "likes": 567,
  "platform": "AVC Fitness Center",
  "createdAt": "Firestore Timestamp"
}
```

## Colecciones de Formularios (Generadas Automáticamente)

### `contacts`
Los mensajes del formulario de contacto se guardan automáticamente con esta estructura:
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+52 55 1234 5678",
  "message": "Hola, me gustaría saber...",
  "createdAt": "Firestore Timestamp"
}
```

### `feedback`
Las dudas y preguntas se guardan así:
```json
{
  "name": "María García",
  "email": "maria@email.com",
  "question": "¿Cuánto cuesta la membresía premium?",
  "createdAt": "Firestore Timestamp"
}
```

### `newMembers`
Las inscripciones de nuevos miembros:
```json
{
  "name": "Roberto López",
  "email": "roberto@email.com",
  "phone": "+52 55 9876 5432",
  "membership": "premium",
  "goals": "Quiero perder peso y ganar fuerza",
  "experience": "beginner",
  "startDate": "2025-02-01",
  "status": "pending",
  "createdAt": "Firestore Timestamp"
}
```

## Índices Recomendados en Firestore

Para optimizar las consultas, crea estos índices compuestos:

1. **Collection: `posts`**
   - `publishedAt` (Descending)

2. **Collection: `events`**
   - `date` (Descending)

3. **Collection: `socialPosts`**
   - `createdAt` (Descending)

4. **Collection: `testimonials`**
   - `createdAt` (Descending)

## Reglas de Seguridad Sugeridas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Lectura pública, escritura solo admin
    match /coaches/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /posts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /testimonials/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /socialPosts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Formularios: solo escritura
    match /contacts/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
    }
    
    match /feedback/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
    }
    
    match /newMembers/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
    }
  }
}
```

## Notas Importantes

1. **Timestamps**: Usa `serverTimestamp()` de Firebase para crear timestamps automáticos
2. **Imágenes**: Reemplaza los placeholders con URLs reales de imágenes
3. **Slugs**: Asegúrate de que los slugs sean únicos y URL-friendly
4. **Índices**: Firebase te pedirá crear índices cuando ejecutes queries complejas
