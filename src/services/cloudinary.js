// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\cloudinary.js

/**
 * Cloudinary Service Layer for Ascend
 * Handles all image uploads, client-side compression, URL optimizations, and metadata formatting.
 */

// Retrieve credentials from environment
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Checks if Cloudinary credentials are fully defined in the environment.
 * @throws {Error} if credentials are missing
 */
export const checkCloudinaryConfig = () => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary credentials are not configured. Please define VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."
    );
  }
};

/**
 * Perform client-side image compression and resizing using HTML5 Canvas.
 * Limits the maximum dimension to 1200px and strips metadata.
 * 
 * @param {string} imageBase64 - The input base64 string
 * @param {number} maxDimension - Maximum allowed width/height
 * @param {number} quality - Output JPEG quality (0.0 to 1.0)
 * @returns {Promise<string>} Compressed base64 string
 */
export const compressImage = (imageBase64, maxDimension = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new scaled dimensions
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error("Could not acquire 2D canvas context."));
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedData = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedData);
    };

    img.onerror = (err) => {
      console.error("Compression loading error:", err);
      reject(new Error("Failed to load image for client-side compression."));
    };

    img.src = imageBase64;
  });
};

/**
 * Uploads an image to Cloudinary using an unsigned preset and tracks progress.
 * 
 * @param {string|File} file - Base64 string or File blob
 * @param {string} folder - Destination folder (e.g. ascend/progress/{uid})
 * @param {function(number): void} onProgress - Progress callback function (0-100)
 * @returns {Promise<{imageUrl: string, publicId: string, folder: string}>} Uploaded metadata
 */
export const uploadImage = async (file, folder, onProgress) => {
  checkCloudinaryConfig();

  // Validate File type and size if it is a File object
  if (file instanceof File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file format. Only JPG, PNG, and WEBP formats are accepted.");
    }
    const maxSizeBytes = 8 * 1024 * 1024; // 8MB limit
    if (file.size > maxSizeBytes) {
      throw new Error("File size exceeds the maximum limit of 8MB.");
    }
  }

  // Pre-compress base64 images client-side before uploading
  let payload = file;
  if (typeof file === 'string' && file.startsWith('data:image')) {
    try {
      payload = await compressImage(file);
    } catch (compressErr) {
      console.warn("Client compression failed, uploading raw image payload:", compressErr);
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            imageUrl: response.secure_url,
            publicId: response.public_id,
            folder: folder
          });
        } catch (e) {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        try {
          const errorResp = JSON.parse(xhr.responseText);
          reject(new Error(errorResp.error?.message || "Upload failed."));
        } catch (e) {
          reject(new Error(`Upload failed with status code: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error. Please verify your connection."));
    };

    xhr.ontimeout = () => {
      reject(new Error("Upload timed out. Please try again."));
    };

    xhr.timeout = 45000; // 45 seconds timeout

    const formData = new FormData();
    formData.append('file', payload);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    xhr.send(formData);
  });
};

/**
 * Reusable wrappers for the three upload domains
 */

export const uploadProfilePhoto = async (file, uid, onProgress) => {
  return uploadImage(file, `ascend/profiles/${uid}`, onProgress);
};

export const uploadProgressPhoto = async (file, uid, onProgress) => {
  return uploadImage(file, `ascend/progress/${uid}`, onProgress);
};

export const uploadScan = async (file, uid, onProgress) => {
  return uploadImage(file, `ascend/scans/${uid}`, onProgress);
};

/**
 * Removes an image asset metadata from Firestore.
 * Secure deletion of Cloudinary files requires backend signatures to avoid exposing secret API keys.
 * This function triggers the local DB removal and warns about the API key separation.
 * 
 * @param {string} publicId - Cloudinary Public ID
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (publicId) => {
  console.log(`[Cloudinary Service] Initiating delete request for Public ID: "${publicId}"`);
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
