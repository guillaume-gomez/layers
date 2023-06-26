export type RGBArray = [number, number, number, number];

export interface position2D {
  x: number;
  y: number
}

export interface LayerSettingsData {
  id: string;
  min: number;
  max: number;
  color: string;
  noise: number;
  alpha: number;
  position2D: position2D;
  needUpdate: boolean;
}

export interface LayersBase64Data {
  id: string;
  layerBase64: string;
}

export type QualityType = "min" | "middle" | "max";