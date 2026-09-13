/**
 * Utility function to create a new Blob from a cropped area of an image.
 */

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw the image onto the canvas
  ctx.drawImage(image, 0, 0);

  // create a new canvas for the cropped area
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as a Blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        file.name = "cropped.jpeg";
        resolve(file);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg", 1);
  });
}
