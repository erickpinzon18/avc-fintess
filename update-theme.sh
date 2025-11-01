#!/bin/bash

# Páginas a actualizar
pages=(
  "src/app/contacto/page.js"
  "src/app/dudas/page.js"
  "src/app/redes/page.js"
  "src/app/unete/page.js"
  "src/app/eventos/page.js"
)

for file in "${pages[@]}"; do
  if [ -f "$file" ]; then
    echo "Actualizando $file..."
    
    # Reemplazar fondos
    sed -i '' 's/bg-gray-950/bg-gray-50/g' "$file"
    sed -i '' 's/bg-gray-900/bg-white/g' "$file"
    sed-i '' 's/bg-gray-800/bg-gray-100/g' "$file"
    sed -i '' 's/bg-gray-750/bg-gray-50/g' "$file"
    
    # Reemplazar textos
    sed -i '' 's/text-white"/text-gray-900"/g' "$file"
    sed -i '' 's/text-white /text-gray-900 /g' "$file"
    sed -i '' 's/text-gray-400/text-gray-600/g' "$file"
    sed -i '' 's/text-gray-300/text-gray-700/g' "$file"
    sed -i '' 's/text-gray-200/text-gray-600/g' "$file"
    
    # Reemplazar bordes
    sed -i '' 's/border-gray-800/border-gray-200/g' "$file"
    sed -i '' 's/border-gray-700/border-gray-300/g' "$file"
    sed -i '' 's/border-gray-600/border-gray-300/g' "$file"
    
    # Reemplazar hover
    sed -i '' 's/hover:bg-gray-750/hover:bg-gray-100/g' "$file"
    sed -i '' 's/hover:bg-gray-700/hover:bg-gray-50/g' "$file"
    sed -i '' 's/hover:bg-gray-800/hover:bg-gray-100/g' "$file"
    
    echo "✓ $file actualizado"
  fi
done

echo "¡Actualización completada!"
