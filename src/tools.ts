export function imageToGrayScaleCanvas(image : HTMLImageElement, canvas: HTMLCanvasElement) {
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if(!context) {
    console.error("Cannot find context");
    return;
  }
  context.drawImage(image, 0, 0);
  convertToGrayScale(context, image.width, image.height);

}


function convertToGrayScale(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
   const red = imageData.data[i];
   const green = imageData.data[i + 1];
   const blue = imageData.data[i + 2];
   // use gimp algorithm to generate prosper grayscale
   const gray = (red * 0.3 + green * 0.59 + blue * 0.11);

   imageData.data[i] = gray;
   imageData.data[i + 1] = gray;
   imageData.data[i + 2] = gray;
   imageData.data[i + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
}
