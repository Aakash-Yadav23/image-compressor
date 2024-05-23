// utils/compressImage.ts
export const compressImage = (base64Str: string, maxSizeKB: number, callback: (compressedBase64: string) => void) => {
    const img = new Image();
    img.src = base64Str;
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const scaleFactor = Math.sqrt(maxSizeKB / (base64Str.length / 1024));
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
  
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed
  
      callback(compressedBase64);
    };
  };
  