'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Modal para recortar imagen
 * La imagen se muestra completa y el rectángulo de recorte se mueve
 */
export default function ImageCropModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  aspectRatio = '16/9',
  onSave 
}) {
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Calcular tamaños cuando se carga la imagen
    const handleImageLoad = (e) => {
    const img = e.target;
    const container = imgContainerRef.current;
    if (!container) return;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const cropAspect = aspectRatio === '21/9' ? 21/9 : 4/3;
    
    console.log('Image loaded:', {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      imgAspect,
      cropAspect,
      aspectRatio
    });

    let displayWidth, displayHeight;
    const containerWidth = Math.min(container.offsetWidth, 800);
    
    if (imgAspect > 1) {
      // Imagen horizontal
      displayWidth = containerWidth;
      displayHeight = containerWidth / imgAspect;
    } else {
      // Imagen vertical
      displayHeight = Math.min(container.height * 0.7, 600);
      displayWidth = displayHeight * imgAspect;
    }
    
    setImageSize({ width: displayWidth, height: displayHeight });
    
    // Calcular tamaño del rectángulo de recorte
    let rectWidth, rectHeight;
    
    if (cropAspect > imgAspect) {
      // Rectángulo más ancho que la imagen - ajustar por ancho
      rectWidth = displayWidth * 0.8; // 80% del ancho de la imagen
      rectHeight = rectWidth / cropAspect;
    } else {
      // Rectángulo más alto que la imagen - ajustar por altura
      rectHeight = displayHeight * 0.8; // 80% de la altura de la imagen
      rectWidth = rectHeight * cropAspect;
    }
    
    // Asegurar que el rectángulo no sea más grande que la imagen
    if (rectWidth > displayWidth) {
      rectWidth = displayWidth;
      rectHeight = rectWidth / cropAspect;
    }
    if (rectHeight > displayHeight) {
      rectHeight = displayHeight;
      rectWidth = rectHeight * cropAspect;
    }
    
    setCropSize({ width: rectWidth, height: rectHeight });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x,
      y: e.clientY - cropPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // Limitar el movimiento dentro de los límites de la imagen
    newX = Math.max(0, Math.min(newX, imageSize.width - cropSize.width));
    newY = Math.max(0, Math.min(newY, imageSize.height - cropSize.height));

    setCropPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart, cropPosition, imageSize, cropSize]);

  const handleSave = () => {
    // Convertir posición del rectángulo a porcentaje para object-position
    if (imageSize.width > 0 && imageSize.height > 0) {
      // Calcular el centro del rectángulo de recorte
      const centerX = cropPosition.x + (cropSize.width / 2);
      const centerY = cropPosition.y + (cropSize.height / 2);
      
      // Para object-position, necesitamos calcular qué porcentaje de la imagen
      // original debe estar alineado con el centro del contenedor
      // Si el rectángulo está arriba (centerY pequeño), queremos que esa parte esté visible
      // En object-position: 0% = mostrar el inicio, 100% = mostrar el final
      const percentX = (centerX / imageSize.width) * 100;
      const percentY = (centerY / imageSize.height) * 100;
      
      console.log('Crop calculation:', {
        cropPosition,
        cropSize,
        imageSize,
        center: { centerX, centerY },
        percentages: { percentX, percentY }
      });
      
      onSave({ 
        x: Math.min(100, Math.max(0, percentX)), 
        y: Math.min(100, Math.max(0, percentY))
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      {/* Overlay de fondo oscuro */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Contenido del modal */}
      <div className="relative bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ajustar imagen</h2>
            <p className="text-sm text-gray-600 mt-1">Mueve el rectángulo para seleccionar el área visible</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop Area */}
        <div className="p-6 bg-gray-100 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div
            ref={containerRef}
            className="relative bg-gray-900 rounded-lg overflow-hidden"
            style={{
              width: imageSize.width || 'auto',
              height: imageSize.height || 'auto'
            }}
          >
            {/* Imagen de fondo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="w-full h-full object-contain block"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Overlay oscuro SOLO sobre la imagen */}
            {imageSize.width > 0 && (
              <>
                {/* Capa oscura sobre toda la imagen */}
                <div className="absolute inset-0 bg-black opacity-50 pointer-events-none" />

                {/* Rectángulo de recorte (área clara) */}
                <div
                  className="absolute border-4 border-white cursor-move bg-transparent"
                  style={{
                    left: cropPosition.x,
                    top: cropPosition.y,
                    width: cropSize.width,
                    height: cropSize.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="absolute inset-0 border-2 border-dashed border-white opacity-50"></div>
                  
                  {/* Indicador */}
                  {!isDragging && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs pointer-events-none whitespace-nowrap">
                      🖱️ Arrastra para ajustar
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-avc-red hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Guardar posición
          </button>
        </div>
      </div>
    </div>
  );
}
