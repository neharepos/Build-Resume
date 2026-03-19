// src/utils/uploadImage.ts
import { API_PATHS } from './apiPaths';

/**
 * Uploads an image file to the server using the native Fetch API.
 * @param imageFile - The File object to be uploaded.
 * @returns The JSON response from the server.
 */
const uploadImage = async (imageFile: File): Promise<any> => {
    const formData = new FormData();
    
    // The first argument 'image' is the KEY your server expects
    // The second argument 'imageFile' is the actual FILE object
    formData.append('image', imageFile); 

    try {
        const response = await fetch(API_PATHS.image.UPLOAD_IMAGE, {
            method: 'POST',
            body: formData,
        });

        // ... rest of your fetch logic

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload image');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading the image:', error);
        throw error;
    }
};

export default uploadImage;