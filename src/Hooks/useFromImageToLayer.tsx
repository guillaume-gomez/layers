import { useState } from 'react';
import { minBy } from "lodash";
import { pgcd, getContext, colorDistance, resizeImageCanvas } from "../tools";
import { Color } from "../types";


export const dominantImageSizeDefault = 32;

interface pictureData {
  color: Color;
  sprite: HTMLImageElement | undefined;
}

interface FromImageToImagesInterface {
  picturesData: pictureData[];
  dominantImageSize?: number;
}

export interface ImageDataInterface {
  image: HTMLImageElement;
  x: number;
  y: number;
}

export default function useFromImageTolayer({ picturesData, dominantImageSize = dominantImageSizeDefault } : FromImageToImagesInterface) {
  const [imagesData, setImagesData] = useState<ImageDataInterface[]>([]);

  function createCanvasBuffer(image: HTMLImageElement) : HTMLCanvasElement {
    const canvasBuffer = document.createElement("canvas");
    canvasBuffer.width = image.width;
    canvasBuffer.height = image.height;

    const context = getContext(canvasBuffer);
    context.drawImage(image, 0, 0, canvasBuffer.width, canvasBuffer.height);
    return canvasBuffer;
  }

  function generateImage(image: HTMLImageElement, canvasTarget: HTMLCanvasElement) {
      canvasTarget.width = image.width;
      canvasTarget.height = image.height;

      const canvasBuffer = createCanvasBuffer(image);
      const contextBuffer = getContext(canvasBuffer);
      const contextTarget = getContext(canvasTarget);

      for(let y = 0; y < image.height; ++y) {
        for(let x = 0; x < image.width; ++x) {
          const pixelImage = fromColorToDominantImage(fromPixelToColor(contextBuffer, x,y));
          contextTarget.drawImage(pixelImage, x * dominantImageSize, y * dominantImageSize, pixelImage.width, pixelImage.height);
        }
      }
  }



  function fromPixelToColor(context: CanvasRenderingContext2D, x: number, y: number) : Color {
    const pixel = context.getImageData(x, y, 1, 1);
    const { data } = pixel;
    return { red: data[0], green: data[1], blue: data[2] };
  }


  function fromColorToDominantImage(color: Color) : HTMLImageElement {
    const comparaisonValues = picturesData.map(pictureData => ({ ...pictureData, value: colorDistance(color, pictureData.color)}) );
    const foundPixel = minBy(comparaisonValues, 'value');
    if(!foundPixel) {
      throw `No sprite found for the pixel with the value ${color}`;
    }
    if(!foundPixel.sprite) {
      throw new Error("Cannot find the sprite");
    }
    return foundPixel.sprite;
  }


  return { generateImage, optimizedGenerateImage };
}
