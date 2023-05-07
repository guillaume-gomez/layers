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