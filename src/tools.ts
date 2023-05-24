import { RGBArray, QualityType } from "./interfaces";



const qualityHash = {
  "max": { width: 1920, height: 1080 },
  "middle": { width: 1920/2, height: 1080/2 },
  "min": { width: 1920/4, height: 1080/4 },
};

export function imageToGrayScaleCanvas(image : HTMLImageElement, canvas: HTMLCanvasElement, levelOfPerformance: QualityType = "max") {
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if(!context) {
    throw new Error("Cannot find context");
  }
  context.drawImage(image, 0, 0);

  // mutate the result by resizing it
  if(
      image.width > qualityHash[levelOfPerformance].width ||
      image.height > qualityHash[levelOfPerformance].height
    ) {
    resizeImageCanvas(canvas, canvas, qualityHash[levelOfPerformance].width, qualityHash[levelOfPerformance].height);
  }
  convertToGrayScale(context, image.width, image.height);
}

interface imageFromRangeOption {
  min: number;
  max: number;
  noise: number;
  color: RGBArray;
}

export function generateImageFromRange(greyScaleCanvas: HTMLCanvasElement, {min, max, color,noise} : imageFromRangeOption) : string {
  const canvas = document.createElement("canvas");
  canvas.width = greyScaleCanvas.width;
  canvas.height = greyScaleCanvas.height;

  const greyScaleContext = greyScaleCanvas.getContext("2d");
  const outputContext = canvas.getContext("2d");

  if(greyScaleContext && outputContext) {
    copyGreyCanvasByRange(greyScaleContext, outputContext, canvas.width, canvas.height, min, max, noise, color);
    return canvas.toDataURL();
  }

  throw new Error("Cannot find the greyScaleContext or outputContext");
}

export async function mergeImages(layersBase64: string[], width: number, height: number, backgroundColor?: string) : Promise<string> {
    let canvas = document.createElement("canvas");
    if(!canvas) {
      throw new Error("Cannot create a canvas");
    }

    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    if(!context) {
      throw new Error("Cannot create the context for the canvas");
    }

    if(backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    const imagesPromises : Promise<HTMLImageElement>[] = layersBase64.map(layerBase64 => {
      return new Promise((resolve) => {
        let image = new Image();
        image.src = layerBase64;
        image.onload = () => {resolve(image)};
      });
    });

    const images = await Promise.all(imagesPromises);
    images.forEach(image => {
      context!.drawImage(image, 0, 0, canvas.width, canvas.height);
    });

    return canvas.toDataURL(`image/png`);
}

// randomise depending of scale
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

function copyGreyCanvasByRange(
  greyScaleContext: CanvasRenderingContext2D,
  outputContext: CanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number,
  noise: number,
  color: RGBArray,
  ) {
  const imageData = greyScaleContext.getImageData(0, 0, width, height);
  const imageDateOutput = outputContext.getImageData(0, 0, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    // as gray image, all components are the same
    const value = imageData.data[i];
    if(shouldDraw(min, max, noise, value, "else")) {
      imageDateOutput.data[i] = color[0];
      imageDateOutput.data[i + 1] = color[1];
      imageDateOutput.data[i + 2] = color[2];
      imageDateOutput.data[i + 3] = color[3];
    } else {
      imageDateOutput.data[i] = 0;
      imageDateOutput.data[i + 1] = 0;
      imageDateOutput.data[i + 2] = 0;
      imageDateOutput.data[i + 3] = 0;
    }
  }
  outputContext.putImageData(imageDateOutput, 0, 0);
}

function shouldDraw(min: number, max: number, noise: number, pixelGreyValue: number, mode: string = "default") : boolean {
  if(mode === "default") {
    return (pixelGreyValue >= min && pixelGreyValue <= max);
  } else {
    const randomChoose = Math.random() * 100;
    return (pixelGreyValue >= min && pixelGreyValue <= max) && (randomChoose >= noise);
  }

  return false;
}

function resizeImageCanvas(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
  // resize image
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = canvasBuffer.getContext("2d");
  if(!contextBuffer) {
    throw new Error("Cannot find context");
  }

  // resize to 50%
  canvasBuffer.width = originCanvas.width * 0.5;
  canvasBuffer.height = originCanvas.height * 0.5;
  contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

  contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

  const contextTarget = targetCanvas.getContext("2d");
  if(!contextTarget) {
    throw new Error("Cannot find context");
  }

  targetCanvas.width = expectedWidth;
  targetCanvas.height = expectedHeight;

  contextTarget.drawImage(
    canvasBuffer,
    0,
    0,
    canvasBuffer.width * 0.5,
    canvasBuffer.height * 0.5,
    0,
    0,
    expectedWidth,
    expectedHeight
  );
}
