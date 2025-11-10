import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Sube una imagen o video a Firebase Storage
 * @param {File} file - Archivo de imagen o video a subir
 * @param {string} category - Categoría (ej: 'clases', 'blog', 'galeria')
 * @param {string} subcategory - Subcategoría (ej: nombre de la clase)
 * @param {string} filename - Nombre del archivo (opcional, usa el nombre original si no se proporciona)
 * @returns {Promise<string>} URL de descarga del archivo subido
 */
export async function uploadImage(file, category, subcategory, filename = null) {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  // Validar que sea una imagen o video
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('El archivo debe ser una imagen o video');
  }

  // Generar nombre único si no se proporciona
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const finalFilename = filename || `${timestamp}.${extension}`;
  
  // Crear ruta: category/subcategory/filename (o category/filename si no hay subcategory)
  const storagePath = subcategory 
    ? `${category}/${subcategory}/${finalFilename}`
    : `${category}/${finalFilename}`;
  const storageRef = ref(storage, storagePath);

  try {
    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, file);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw new Error(`Error al subir el archivo: ${error.message}`);
  }
}

/**
 * Elimina una imagen de Firebase Storage usando su URL
 * @param {string} imageUrl - URL de la imagen a eliminar
 * @returns {Promise<void>}
 */
export async function deleteImage(imageUrl) {
  if (!imageUrl) return;

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    // No lanzar error si la imagen no existe
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

/**
 * Convierte un archivo a base64 para preview
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} String base64 de la imagen
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
