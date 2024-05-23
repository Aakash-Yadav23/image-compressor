// utils/compressImage.ts
/* eslint-disable arrow-body-style */
const compressBase64Image = (
    base64ImageString: string,
    targetSizeKB: number,
    maxOriginalSizeKB: number,
    progressCallback: (currentSizeKB: number) => void
) => {
    return new Promise<string>((resolve, reject) => {
        // Create an image element
        const img = new Image();

        img.onload = () => {
            const originalSizeKB = base64ImageString.length / 1024;

            if (originalSizeKB > maxOriginalSizeKB) {
                // If the original size is greater than maxOriginalSizeKB, proceed with compression
                console.log(`Original image size: ${originalSizeKB} KB`);
                tryCompression(0.9); // Adjust the initial quality based on your preference
            } else {
                // If the original size is within the limit, resolve with the original base64 string
                console.log(`Original image size within the limit: ${originalSizeKB} KB`);
                resolve(base64ImageString);
            }
        };

        img.onerror = (error) => {
            // Reject with an error if there's an issue loading the image
            reject(error);
        };

        // Set the source of the image to the Base64 string
        img.src = base64ImageString;

        const tryCompression = (quality: number) => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression resulted in null blob'));
                            return;
                        }
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);

                        reader.onloadend = () => {
                            const compressedBase64 = reader.result as string;
                            const compressedSizeKB = compressedBase64.length / 1024;

                            progressCallback(compressedSizeKB); // Update progress

                            console.log(`Compressed image size: ${compressedSizeKB} KB`);

                            if (compressedSizeKB <= targetSizeKB) {
                                // If compressed size is within the target range, resolve with the compressed base64 string
                                resolve(compressedBase64);
                            } else if (quality > 0.1) {
                                // If size is not within the range, try again with reduced quality
                                tryCompression(quality - 0.05);
                            } else {
                                // If quality is too low, reject with an error
                                reject(new Error('Unable to meet target size.'));
                            }
                        };
                    },
                    'image/jpeg',
                    quality
                );
            } catch (error) {
                // Reject the promise if any error occurs during the process
                reject(error);
            }
        };
    });
};

export default compressBase64Image;
