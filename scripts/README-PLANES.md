# Script: Agregar Planes a Firestore

## Descripción
Este script agrega 9 planes de membresía a la colección `planes` en Firestore.

## Planes incluidos
1. **CrossFit** - Plan más popular con acceso completo
2. **Funcional** - Entrenamiento funcional adaptado
3. **Halterofilia** - Técnica olímpica especializada
4. **Indoor Cycling** - Sistema de paquetes de clases
5. **Zumba** - Paquetes de clases de baile
6. **Funcional Kids** - Para niños de 6-11 años
7. **Salsa y Cumbia** - Baile latino
8. **Flexibilidad y Movilidad** - Prevención y recuperación
9. **AVC Competición** - Para atletas competitivos

## Uso

```bash
npm run add-planes
```

## Campos de cada plan
- `name`: Nombre del plan
- `price`: Precio principal
- `period`: Período (ej: "/mes", "12 clases")
- `description`: Descripción corta y vendedora
- `features`: Array de características incluidas
- `popular`: Boolean indicando si es el plan destacado
- `color`: Color del tema del plan
- `icon`: Emoji representativo
- `benefits`: Array de beneficios adicionales
- `order`: Orden de visualización
- `active`: Estado del plan (siempre true por defecto)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

## ⚠️ Advertencia
Este script creará documentos nuevos cada vez que se ejecute. No verifica duplicados. Si lo ejecutas múltiples veces, tendrás planes duplicados.

## Próximos pasos
Después de ejecutar este script, la página `/horarios` cargará automáticamente los planes desde Firestore en lugar de usar datos estáticos.
