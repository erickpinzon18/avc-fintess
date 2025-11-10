'use client';

import { useState, useRef, useEffect } from 'react';
import ImageCropModal from './ImageCropModal';

export default function ImageUploader({ 
  label = "Imagen",
  currentImage = null,
  onImageSelect,
  height = "h-64",
  helpText = "",
  acceptVideo = false
}) {
  const [preview, setPreview] = useState(currentImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentImage);
    // Detectar si es un video
    if (currentImage && currentImage.includes('firebasestorage')) {
      // Intentar determinar si es video por extensión
      const ext = currentImage.split('?')[0].split('.').pop().toLowerCase();
      setIsVideo(['mp4', 'mov', 'avi', 'webm', 'ogg'].includes(ext));
    }
  }, [currentImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideoFile = file.type.startsWith('video/');
      const isImageFile = file.type.startsWith('image/');
      
      if ((acceptVideo && isVideoFile) || isImageFile) {
        setSelectedFile(file);
        setIsVideo(isVideoFile);
        
        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Notificar al padre
        onImageSelect(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    setIsVideo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Contenedor de la imagen/video con aspect ratio */}
      <div className={`relative w-full ${height} bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200`}>
        {preview ? (
          <>
            {isVideo ? (
              <video
                src={preview}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              >
                Tu navegador no soporta videos.
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          // Área de carga cuando no hay imagen/video
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 font-semibold mb-1">
              {acceptVideo ? 'Haz clic para subir video' : 'Haz clic para subir imagen'}
            </p>
            <p className="text-gray-500 text-xs">
              {acceptVideo ? 'MP4, MOV, AVI o WEBM' : 'JPG, PNG o WEBP'}
            </p>
          </button>
        )}
      </div>

      {/* Botones de control debajo de la imagen */}
      {preview && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cambiar Imagen
          </button>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}

      {helpText && (
        <p className="text-xs text-gray-500 mt-2">{helpText}</p>
      )}
    </div>
  );
}
