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

export function generateImageFromRange(greyScaleCanvas: HTMLCanvasElement, min: number, max: number) : HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = greyScaleCanvas.width;
  canvas.height = greyScaleCanvas.height;

  const greyScaleContext = greyScaleCanvas.getContext("2d");
  const outputContext = canvas.getContext("2d");

  if(greyScaleContext && outputContext) {
    copyGreyCanvasByRange(greyScaleContext, outputContext, canvas.width, canvas.height, min, max);
    return canvas;
  }

  throw new Error("Cannot find the greyScaleContext or outputContext");
}

function copyGreyCanvasByRange(
  greyScaleContext: CanvasRenderingContext2D,
  outputContext: CanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number
  ) {
  const imageData = greyScaleContext.getImageData(0, 0, width, height);
  const imageDateOutput = outputContext.getImageData(0, 0, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    // as gray image, all components are the same
    const value = imageData.data[i];
    if(min <= value && value > max) {
      imageDateOutput.data[i] = value;
      imageDateOutput.data[i + 1] = value;
      imageDateOutput.data[i + 2] = value;
      imageDateOutput.data[i + 3] = 255;
    } else {
      imageDateOutput.data[i] = 0;
      imageDateOutput.data[i + 1] = 0;
      imageDateOutput.data[i + 2] = 0;
      imageDateOutput.data[i + 3] = 255;
    }
  }
  outputContext.putImageData(imageDateOutput, 0, 0);
}