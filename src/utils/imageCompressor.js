/**
 * Compresses and resizes an image file to a lightweight Base64 string
 * suitable for localStorage and high-performance web rendering.
 */
export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        // For PNG, WebP, or SVG, try WebP format first to preserve transparency and minimize file size
        if (file?.type === "image/png" || file?.type === "image/webp" || file?.type === "image/svg+xml") {
          try {
            ctx.drawImage(img, 0, 0, width, height);
            const webpData = canvas.toDataURL("image/webp", quality);
            if (webpData && webpData.startsWith("data:image/webp")) {
              resolve(webpData);
              return;
            }
          } catch {
            // Fall back to JPEG below
          }
        }

        // For JPEG, fill clean background first so transparent pixels never become solid black
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Only fallback if original file is sufficiently small (< 150KB) to prevent storage quota crash
        if (file && file.size < 150000 && event.target?.result) {
          resolve(event.target.result);
        } else {
          reject(new Error("Unable to decode this image format. Please select a valid JPG, PNG, or WebP image."));
        }
      };
    };

    reader.onerror = (err) => reject(err);
  });
}
