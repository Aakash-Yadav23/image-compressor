// utils/compressImage.ts
/* eslint-disable arrow-body-style */
const compressBase64Image = (
    base64ImageString: string,
    targetSizeKB: number,
    progressCallback: (currentSizeKB: number) => void
): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        // Create an image element
        const img = new Image();

        img.onload = () => {
            const originalSizeKB = (base64ImageString.length * 3) / 4 / 1024;

            if (originalSizeKB > targetSizeKB) {
                // If the original size is greater than targetSizeKB, proceed with compression
                console.log(`Original image size: ${originalSizeKB} KB`);
                compressImageIteratively(1.0, 0.0, base64ImageString, resolve, reject, targetSizeKB, progressCallback); // Start with maximum quality
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
    });
};

const compressImageIteratively = (
    high: number,
    low: number,
    base64ImageString: string,
    resolve: (value: string | PromiseLike<string>) => void,
    reject: (reason?: any) => void,
    targetSizeKB: number,
    progressCallback: (currentSizeKB: number) => void
) => {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const quality = (high + low) / 2;
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
                    const compressedSizeKB = (compressedBase64.length * 3) / 4 / 1024;

                    progressCallback(compressedSizeKB); // Update progress

                    console.log(`Compressed image size: ${compressedSizeKB} KB at quality: ${quality}`);

                    if (compressedSizeKB <= targetSizeKB + 4 && compressedSizeKB >= targetSizeKB - 4) {
                        // If compressed size is within the target range, resolve with the compressed base64 string
                        resolve(compressedBase64);
                    } else if (high - low < 0.01) {
                        // If the difference is too small, resolve with the best effort compressed base64 string
                        resolve(compressedBase64);
                    } else if (compressedSizeKB > targetSizeKB) {
                        // If size is too large, decrease quality
                        compressImageIteratively(quality, low, base64ImageString, resolve, reject, targetSizeKB, progressCallback);
                    } else {
                        // If size is too small, increase quality
                        compressImageIteratively(high, quality, base64ImageString, resolve, reject, targetSizeKB, progressCallback);
                    }
                };
            },
            'image/jpeg',
            quality
        );
    };

    img.src = base64ImageString;
};

export default compressBase64Image;
