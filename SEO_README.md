# SEO Dinámico - AVC Fitness

## Implementación de Metadata Optimizada

Se ha implementado un sistema de SEO dinámico para las páginas principales de AVC Fitness.

### 📄 Página Principal (`/`)

**Metadata estática:**
- **Título:** AVC Fitness - Tu Casa Fitness | CrossFit, Funcional y Halterofilia en Querétaro
- **Descripción:** Únete a AVC Fitness, tu casa fitness en Querétaro. CrossFit, Funcional, Halterofilia y más. Ambiente familiar, coaches capacitados y comunidad activa.
- **Keywords:** CrossFit Querétaro, gimnasio Querétaro, funcional Querétaro, halterofilia, fitness Querétaro, AVC Fitness
- **Open Graph y Twitter Cards** configurados para compartir en redes sociales
- **JSON-LD Schema** para Google con información del gimnasio (GymOrHealthClub)

### 📅 Página de Horarios (`/horarios`)

**Metadata dinámica:**
- Se actualiza automáticamente basándose en:
  - **Clases del día actual:** Muestra cuántas clases hay hoy y los nombres
  - **WOD del día:** Incluye el título, modalidad y time cap del WOD
  
**Ejemplo de título dinámico:**
```
Lunes: 8 Clases Disponibles | AVC Fitness
```

**Ejemplo de descripción para compartir:**
```
🔥 Lunes

📅 8 clases: CrossFit 06:00, Funcional 07:00, Halterofilia 08:00

💪 WOD: Fran (For Time) - 21 min
```

**JSON-LD Schema dinámico:**
- Eventos de las clases del día con horarios
- Plan de ejercicio (WOD) del día
- Información estructurada para buscadores

## 🎯 Beneficios

### Cuando compartes la página `/horarios`:
1. **WhatsApp/Telegram:** Muestra un preview con el resumen del día y WOD
2. **Facebook/Instagram:** Card con imagen y descripción actualizada
3. **Google:** Indexa las clases del día como eventos estructurados
4. **Buscadores:** Mejor posicionamiento con datos estructurados

### SEO General:
- ✅ Open Graph Tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ JSON-LD Schema.org
- ✅ Meta robots configurado
- ✅ Canonical URLs
- ✅ Favicons multi-dispositivo

## 🔄 Actualización Automática

La metadata de `/horarios` se regenera en cada build/deploy, mostrando siempre:
- Clases del día actual
- WOD más reciente
- Horarios actualizados

## 📱 Preview en Redes Sociales

Cuando compartas:
- `https://avcfitness.com` → Muestra info general del gym
- `https://avcfitness.com/horarios` → Muestra clases y WOD del día actual

## 🛠️ Archivos Modificados

1. `/src/app/page.tsx` - Metadata estática de home
2. `/src/app/HomePage.js` - Componente de home (renombrado)
3. `/src/app/horarios/page.tsx` - Metadata dinámica de horarios
4. `/src/app/horarios/HorariosPage.js` - Componente de horarios (renombrado)
5. `/src/app/layout.tsx` - Favicons configurados

## ⚙️ Configuración de Favicons

Se configuraron todos los favicons desde `/public/assets/favico/`:
- ✅ Favicon estándar (16x16, 32x32, 96x96, .ico)
- ✅ Apple Touch Icons (todos los tamaños)
- ✅ Android Chrome Icons
- ✅ MS Tiles

Ya no se mostrará el favicon de Vercel por defecto.

## 📊 Testing

Para probar cómo se ve al compartir:
1. **Facebook:** https://developers.facebook.com/tools/debug/
2. **Twitter:** https://cards-dev.twitter.com/validator
3. **LinkedIn:** https://www.linkedin.com/post-inspector/

---

**Nota:** La metadata dinámica se genera en el servidor (Server Components) para mejor performance y SEO.
