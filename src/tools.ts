import { RGBArray } from "./interfaces";

export function imageToGrayScaleCanvas(image : HTMLImageElement, canvas: HTMLCanvasElement) {
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if(!context) {
    throw new Error("Cannot find context");
  }
  context.drawImage(image, 0, 0);
  convertToGrayScale(context, image.width, image.height);

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

interface imageFromRangeOption {
  min: number;
  max: number;
  alpha: number;
  color: RGBArray;
  backgroundColor: RGBArray;
}

export function generateImageFromRange(greyScaleCanvas: HTMLCanvasElement, {min, max, alpha, color, backgroundColor} : imageFromRangeOption) : string {
  const canvas = document.createElement("canvas");
  canvas.width = greyScaleCanvas.width;
  canvas.height = greyScaleCanvas.height;

  const greyScaleContext = greyScaleCanvas.getContext("2d");
  const outputContext = canvas.getContext("2d");

  if(greyScaleContext && outputContext) {
    copyGreyCanvasByRange(greyScaleContext, outputContext, canvas.width, canvas.height, min, max, alpha, color, backgroundColor);
    return canvas.toDataURL();
  }

  throw new Error("Cannot find the greyScaleContext or outputContext");
}

function averageArea(context: CanvasRenderingContext2D, areaWidth: number, x: number, y: number) : RGBArray {
  const pixels = context.getImageData(x,y, areaWidth, areaWidth);
  const { data } = pixels;
  const numberOfPixels = areaWidth * areaWidth;
  let red = 0;
  let green = 0;
  let blue = 0;


  for (let i = 0; i < data.length; i += 4) {
    red += data[i];
    green += data[i + 1];
    blue += data[i + 2];
  }

  return [(red/numberOfPixels), (green/numberOfPixels), (blue/numberOfPixels)];
}

function fillArea(outputContext: CanvasRenderingContext2D, areaWidth: number, x: number, y: number, choosenColor : RGBArray, alpha: number) {
  const imageDateOutput = outputContext.getImageData(0, 0, areaWidth, areaWidth);
  for (let i = 0; i < imageDateOutput.data.length; i += 4) {
      imageDateOutput.data[i] = choosenColor[0];
      imageDateOutput.data[i + 1] = choosenColor[1];
      imageDateOutput.data[i + 2] = choosenColor[2];
      imageDateOutput.data[i + 3] = alpha;
  }
}


function copyGreyCanvasByRange(
  greyScaleContext: CanvasRenderingContext2D,
  outputContext: CanvasRenderingContext2D,
  width: number,
  height: number,
  min: number,
  max: number,
  alpha: number,
  color: RGBArray,
  backgroundColor: RGBArray

  ) {
  const imageData = greyScaleContext.getImageData(0, 0, width, height);
  const imageDateOutput = outputContext.getImageData(0, 0, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    // as gray image, all components are the same
    const value = imageData.data[i];
    if(value >= min && value < max) {
      imageDateOutput.data[i] = color[0];
      imageDateOutput.data[i + 1] = color[1];
      imageDateOutput.data[i + 2] = color[2];
      imageDateOutput.data[i + 3] = alpha;
    } else {
      imageDateOutput.data[i] = backgroundColor[0];
      imageDateOutput.data[i + 1] = backgroundColor[1];
      imageDateOutput.data[i + 2] = backgroundColor[2];
      imageDateOutput.data[i + 3] = alpha;
    }
  }
  outputContext.putImageData(imageDateOutput, 0, 0);
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