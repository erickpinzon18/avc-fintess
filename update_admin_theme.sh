#!/bin/bash

# Script para actualizar tema oscuro a claro en páginas de admin

files=(
  "src/app/admin/planes/page.js"
  "src/app/admin/testimonios/page.js"
  "src/app/admin/coaches/page.js"
  "src/app/admin/horarios/page.js"
  "src/app/admin/galeria/page.js"
  "src/app/admin/clases/page.js"
  "src/app/admin/eventos/page.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Actualizando $file..."
    
    # Reemplazar colores de fondo
    sed -i '' 's/bg-gray-950/bg-gray-50/g' "$file"
    sed -i '' 's/bg-gray-900/bg-white/g' "$file"
    sed -i '' 's/bg-gray-800/bg-gray-100/g' "$file"
    
    # Reemplazar colores de texto
    sed -i '' 's/text-white"/text-gray-900"/g' "$file"
    sed -i '' 's/text-white /text-gray-900 /g' "$file"
    sed -i '' 's/text-gray-400/text-gray-600/g' "$file"
    sed -i '' 's/text-gray-300/text-gray-700/g' "$file"
    
    # Reemplazar bordes
    sed -i '' 's/border-gray-800/border-gray-200/g' "$file"
    sed -i '' 's/border-gray-700/border-gray-300/g' "$file"
    
    # Reemplazar hovers
    sed -i '' 's/hover:bg-gray-700/hover:bg-gray-50/g' "$file"
    sed -i '' 's/hover:bg-gray-800/hover:bg-gray-100/g' "$file"
    sed -i '' 's/hover:text-white/hover:text-gray-900/g' "$file"
    
    echo "✓ $file actualizado"
  fi
done

echo "¡Todas las páginas han sido actualizadas!"
