// ============================================
// FILE: backend/utils/cloudinary.js - COMPLETE FIX
// ============================================
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// ✅ Load environment variables first
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Verify configuration on load
console.log('✅ Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

// ============================================
// UPLOAD TO CLOUDINARY
// ============================================
export const uploadToCloudinary = (buffer, optionsOrFolder = {}) => {
  return new Promise((resolve, reject) => {
    // Handle backward compatibility: if second param is string, treat as folder
    let uploadOptions;
    
    if (typeof optionsOrFolder === 'string') {
      uploadOptions = {
        resource_type: 'image',
        folder: optionsOrFolder,
        transformation: [
          { width: 1280, height: 720, crop: 'fill', quality: 'auto' },
          { format: 'webp' },
        ],
      };
    } else {
      // Use options object with sensible defaults
      uploadOptions = {
        folder: 'uploads',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...optionsOrFolder // Override defaults with provided options
      };

      // ✅ Special handling for PDFs
      if (uploadOptions.format === 'pdf' || uploadOptions.resource_type === 'raw') {
        uploadOptions.resource_type = 'raw';
        uploadOptions.type = 'upload';
        uploadOptions.access_mode = 'public';
        uploadOptions.flags = 'attachment:false';
        uploadOptions.delivery_type = 'upload';
        delete uploadOptions.quality;
        delete uploadOptions.fetch_format;
      }

      // ✅ Special handling for videos
      if (uploadOptions.resource_type === 'video') {
        uploadOptions.type = 'upload';
        uploadOptions.access_mode = 'public';
        uploadOptions.resource_type = 'video';
        uploadOptions.chunk_size = 6000000; // 6MB chunks for large videos
      }
    }

    console.log(`📤 Uploading to Cloudinary:`, {
      folder: uploadOptions.folder,
      resource_type: uploadOptions.resource_type,
      format: uploadOptions.format || 'auto',
      size: `${(buffer.length / 1024 / 1024).toFixed(2)} MB`
    });

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          return reject(error);
        }

        console.log(`✅ Cloudinary upload successful:`, {
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          size: `${(result.bytes / 1024 / 1024).toFixed(2)} MB`,
          url: result.secure_url.substring(0, 60) + '...'
        });

        // ✅ CRITICAL FIX: Return an object with both url and secure_url
        // This ensures compatibility with ALL routes (admin and user)
        resolve({
          url: result.secure_url,           // ✅ For user routes
          secure_url: result.secure_url,    // ✅ For admin routes
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    stream.end(buffer);
  });
};

// ============================================
// DELETE FROM CLOUDINARY
// ============================================
export const deleteFromCloudinary = (publicId, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary delete error:', error);
          return reject(error);
        }
        console.log('✅ Cloudinary delete successful:', publicId);
        resolve(result);
      }
    );
  });
};

// ============================================
// GET PUBLIC ID FROM URL
// ============================================
export const getPublicIdFromUrl = (url, folder = 'uploads') => {
  try {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return `${folder}/${publicId}`;
  } catch (error) {
    console.error('❌ Error extracting public ID:', error);
    return null;
  }
};

// ============================================
// GET FILE PUBLIC ID (for nested folders)
// ============================================
export const getFilePublicId = (url) => {
  try {
    // Extract the path part after the version number
    const urlParts = url.split('/');
    const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
    
    if (versionIndex === -1) return null;

    const pathParts = urlParts.slice(versionIndex + 1);
    const publicIdWithExtension = pathParts.join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension

    return publicId;
  } catch (error) {
    console.error('❌ Error extracting file public ID:', error);
    return null;
  }
};

// ============================================
// EXPORT
// ============================================
export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  getFilePublicId,
};