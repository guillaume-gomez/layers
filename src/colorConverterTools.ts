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

export function RGBAToCSS(color: RGBArray) : string {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
}


export function fromRGBToRGBA(color: string, alpha: number) : string {
    return `${color}${alpha.toString(16).padStart(2, "0")}`
}
