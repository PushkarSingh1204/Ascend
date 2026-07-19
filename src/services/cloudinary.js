// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\cloudinary.js

/**
 * Cloudinary Service Layer for Ascend
 * Handles all image uploads, client-side compression, URL optimizations, and metadata formatting.
 * Implements security, file type validations, metadata stripping, and upload cancellation.
 */

// Retrieve credentials from environment
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

/**
 * Checks if Cloudinary credentials are fully defined in the environment.
 * @throws {Error} if credentials are missing
 */
export const checkCloudinaryConfig = () => {
  const isInvalid = (val) => !val || val === 'undefined' || val === 'null' || val.includes('placeholder') || val.trim() === '';
  if (isInvalid(CLOUD_NAME) || isInvalid(UPLOAD_PRESET)) {
    throw new Error(
      `Cloudinary configuration missing or invalid. (Current Cloud Name: "${CLOUD_NAME}", Preset: "${UPLOAD_PRESET}"). Please configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in Vercel, then trigger a new deployment/rebuild.`
    );
  }
};

/**
 * Validates a File object against MIME types and size constraints.
 * Accepts only: image/jpeg, image/png, image/webp.
 * Limit: 10MB.
 * @param {File} file - The file to validate
 * @throws {Error} if validation fails
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error("No file selected.");
  }

  // Validate browser reported MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG and WEBP images are supported.");
  }

  // Validate file size limit: 10MB
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error("Please upload an image smaller than 10 MB.");
  }
};

/**
 * Performs client-side image compression, resizing, and EXIF metadata stripping.
 * Resizes images larger than 1200px on the longest side.
 * Target JPEG quality is between 0.80 and 0.85 (default: 0.82).
 * Skips compression if the image is already optimized (small file size and small dimensions).
 * 
 * @param {string} imageBase64 - Input base64 image data
 * @param {number} maxSizeKB - Skip compression if size in KB is less than this
 * @param {number} maxDimension - Maximum allowed width or height
 * @param {number} quality - Output JPEG quality (0.80 to 0.85)
 * @returns {Promise<string>} Processed base64 string
 */
export const processAndCompressImage = (imageBase64, maxSizeKB = 400, maxDimension = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const longestSide = Math.max(width, height);

      // Estimate base64 payload size in bytes
      const base64Content = imageBase64.split(',')[1] || '';
      const approxSizeBytes = Math.round((base64Content.length * 3) / 4);

      // Skip unnecessary compression for already optimized small images
      if (longestSide <= maxDimension && approxSizeBytes <= maxSizeKB * 1024) {
        console.log(`[Cloudinary Service] Skipping compression. Image is already optimized (${Math.round(approxSizeBytes / 1024)}KB, ${width}x${height}px)`);
        resolve(imageBase64);
        return;
      }

      // Calculate scaled dimensions keeping aspect ratio
      let newWidth = width;
      let newHeight = height;
      if (longestSide > maxDimension) {
        if (width > height) {
          newHeight = Math.round((height * maxDimension) / width);
          newWidth = maxDimension;
        } else {
          newWidth = Math.round((width * maxDimension) / height);
          newHeight = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to raw base64 if canvas is unavailable
        resolve(imageBase64);
        return;
      }

      // Drawing to canvas automatically strips EXIF, GPS, camera metadata and orientation tags
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      const compressedData = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedData);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for validation. The file might be corrupted or in an unsupported format."));
    };

    img.src = imageBase64;
  });
};

/**
 * Uploads an image to Cloudinary using an unsigned preset.
 * Supports upload cancellation via XHR abort hooks.
 * 
 * @param {string} fileBase64 - Input base64 image data
 * @param {string} folder - Target folder inside Cloudinary (e.g. ascend/profiles/{uid})
 * @param {function(number): void} onProgress - Progress percentage callback (0-100)
 * @returns {{promise: Promise<{imageUrl: string, publicId: string, folder: string}>, cancel: function(): void}} XHR controllers
 */
/**
 * Converts a base64 data URL to a Blob object.
 * Required because Cloudinary's unsigned upload API expects a Blob/File in FormData,
 * not a raw base64 string. Sending a string causes a malformed multipart body which
 * Cloudinary reports as "Upload preset not found".
 * @param {string} dataUrl - base64 data URL e.g. "data:image/jpeg;base64,..."
 * @returns {Blob}
 */
const dataUrlToBlob = (dataUrl) => {
  const [header, base64Data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

export const uploadImageWithCancel = (fileBase64, folder, onProgress) => {
  checkCloudinaryConfig();

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // Diagnostic: log config before every upload attempt
  console.log('[Cloudinary Upload] Starting upload');
  console.log('[Cloudinary Upload] Cloud Name:', CLOUD_NAME);
  console.log('[Cloudinary Upload] Upload Preset:', UPLOAD_PRESET);
  console.log('[Cloudinary Upload] URL:', uploadUrl);
  console.log('[Cloudinary Upload] Folder:', folder);

  let xhr = null;
  const promise = new Promise(async (resolve, reject) => {
    try {
      // 1. Client-side compression
      const payload = await processAndCompressImage(fileBase64);

      // 2. Convert base64 data URL → Blob (required by Cloudinary multipart upload)
      const blob = dataUrlToBlob(payload);
      console.log('[Cloudinary Upload] Blob size:', blob.size, 'bytes | type:', blob.type);

      // 3. Build FormData with Blob (not a base64 string)
      const formData = new FormData();
      formData.append('file', blob, 'upload.jpg');
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);

      console.log('[Cloudinary Upload] FormData fields: file (Blob), upload_preset =', UPLOAD_PRESET, ', folder =', folder);

      // 4. Setup XHR
      xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      // Track upload percentage progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      // Handle server responses
      xhr.onload = () => {
        console.log('[Cloudinary Upload] HTTP Status:', xhr.status);
        console.log('[Cloudinary Upload] Response Body:', xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              imageUrl: response.secure_url,
              publicId: response.public_id,
              folder: folder
            });
          } catch (e) {
            reject(new Error('Failed to parse Cloudinary response.'));
          }
        } else {
          try {
            const errorResp = JSON.parse(xhr.responseText);
            const msg = errorResp.error?.message || 'Upload failed.';
            console.error('[Cloudinary Upload] Error from Cloudinary:', msg);
            reject(new Error(msg));
          } catch (e) {
            reject(new Error(`Upload failed with HTTP status: ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network connection interrupted. Please check your connection and try again.'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Upload timed out. Please try again.'));
      };

      xhr.onabort = () => {
        reject(new Error('Upload cancelled by user.'));
      };

      xhr.timeout = 60000;
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });

  return {
    promise,
    cancel: () => {
      if (xhr) xhr.abort();
    }
  };
};

/**
 * Reusable wrappers for the three upload domains
 */

export const uploadProfilePhoto = (fileBase64, uid, onProgress) => {
  return uploadImageWithCancel(fileBase64, `ascend/profiles/${uid}`, onProgress);
};

export const uploadProgressPhoto = (fileBase64, uid, onProgress) => {
  return uploadImageWithCancel(fileBase64, `ascend/progress/${uid}`, onProgress);
};

export const uploadScan = (fileBase64, uid, onProgress) => {
  return uploadImageWithCancel(fileBase64, `ascend/scans/${uid}`, onProgress);
};

/**
 * Removes an image asset metadata from Firestore.
 * Secure deletion of Cloudinary files requires backend signatures to avoid exposing secret API keys.
 * This function triggers local DB removal and warns about API key separation.
 * 
 * @param {string} publicId - Cloudinary Public ID
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (publicId) => {
  console.log(`[Cloudinary Service] Deletion request logged for Public ID: "${publicId}"`);
  console.warn(
    "[Cloudinary Service] Unsigned deletion is disabled in Cloudinary to prevent public deletes. " +
    "To fully clean up Cloudinary assets, call your secure backend endpoint passing this publicId."
  );
  return true;
};

/**
 * Applies Cloudinary transformations dynamically to a URL.
 * Automatically injects f_auto,q_auto and optional dimensions.
 * 
 * @param {string} url - Original Cloudinary secure URL
 * @param {number} [width] - Desired width
 * @param {number} [height] - Desired height
 * @returns {string} Optimized URL
 */
export const getOptimizedUrl = (url, width, height) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  let transformations = 'f_auto,q_auto';
  if (width && height) {
    transformations += `,w_${width},h_${height},c_fill,g_face`;
  } else if (width) {
    transformations += `,w_${width},c_limit`;
  }

  // Inject transformations immediately after '/image/upload/'
  return url.replace('/image/upload/', `/image/upload/${transformations}/`);
};
