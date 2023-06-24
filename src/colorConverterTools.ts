import { RGBArray } from "./interfaces";

export function hashCode(hexString: string) : number {
    let hash = 0;
    for (let i = 0; i < hexString.length; i++) {
       hash = hexString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

export function intToRGB(intColor: number): string {
    let color = (intColor & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - color.length) + color;
}

export function hexToRGB(hexColor: string, alpha: number) : RGBArray {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

    function hexToDec(hex: string) {
      return parseInt(hex, 16);
    }

    return [
      hexToDec(result![1]),
      hexToDec(result![2]),
      hexToDec(result![3]),
      alpha
    ];
}