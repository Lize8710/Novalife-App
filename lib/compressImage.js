// Compresse une image avant de la convertir en base64
export function compressImage(file, maxWidth = 300, maxHeight = 300, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new window.FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          const reader2 = new window.FileReader();
          reader2.onloadend = () => {
            resolve(reader2.result);
          };
          reader2.onerror = reject;
          reader2.readAsDataURL(blob);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
