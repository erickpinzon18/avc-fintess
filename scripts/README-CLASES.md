# Script para Agregar Clases a Firestore

Este script agrega todas las 9 clases de AVC Fitness a la colección `clases` en Firestore.

## Clases que se agregan:

1. **CrossFit** - Alta intensidad con barra olímpica y movimientos funcionales
2. **Funcional** - Entrenamiento completo para masa muscular y resistencia
3. **Halterofilia** - Especialización en Snatch y Clean & Jerk
4. **Indoor Cycling** - Spinning con música y luces
5. **Zumba** - Baile fitness con ritmos latinos
6. **Funcional Kids** - Versión adaptada para niños de 6-11 años
7. **Salsa y Cumbia** - Clases de baile sin pareja
8. **Flexibilidad** - Estiramientos y movilidad
9. **Eventos Especiales** - Clases temáticas y retos

## Cómo ejecutar el script:

```bash
npm run add-clases
```

## ⚠️ IMPORTANTE:

- **Este script agregará las clases a Firestore cada vez que lo ejecutes**
- Si ya tienes clases en la base de datos, este script AGREGARÁ duplicados
- Solo ejecuta este script UNA VEZ o cuando necesites resetear las clases

## ¿Qué hace el script?

1. Se conecta a Firebase usando las credenciales de `.env.local`
2. Agrega cada una de las 9 clases a la colección `clases`
3. Incluye todos los campos necesarios:
   - `name`: Nombre de la clase
   - `description`: Descripción completa
   - `target`: Público objetivo
   - `benefits`: Beneficios principales
   - `price`: Información de precios
   - `image`: URL de la imagen
   - `freeTrial`: Si ofrece clase muestra gratis (boolean)
   - `promo`: Promociones especiales (string)
   - `trialPrice`: Precio de clase muestra (string)
   - `createdAt`: Fecha de creación

## Verificar las clases

Después de ejecutar el script, puedes verificar que las clases se agregaron:

1. Ve al **Panel de Administración**: `http://localhost:3000/admin`
2. Haz clic en **"Clases"**
3. Verás todas las 9 clases listadas

También puedes ver las clases en el frontend:
- `http://localhost:3000/clases` - Página pública de clases

## Modificar las clases

Si necesitas editar alguna clase después de agregarlas:

1. Ve a `/admin/clases`
2. Haz clic en "Editar" en la clase que quieras modificar
3. Realiza los cambios
4. Guarda

Los cambios se reflejarán automáticamente en la página pública `/clases`.
