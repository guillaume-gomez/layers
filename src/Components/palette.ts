import { sample } from "lodash";

interface paletteColor {
    name: string;
    hex: string;
}

export const palette : paletteColor[] = [
    { name: "black", hex:"#000000" },
    { name: "burgudy", hex:"#914E72" },
    { name: "blue", hex:"#0078BF" },
    { name: "green", hex:"#00A95C" },
    { name: "medium blue", hex:"#3255A4" },
    { name: "bright red", hex:"#F15060" },
    { name: "risofederal blue", hex:"#3D5588" },
    { name: "purple", hex:"#765BA7" },
    { name: "teal", hex:"#00838A" },
    { name: "flat gold", hex:"#BB8B41" },
    { name: "hunter green", hex:"#407060" },
    { name: "red", hex:"#FF665E" },
    { name: "brown", hex:"#925F52" },
    { name: "yellow", hex:"#FFE800" },
    { name: "marine red", hex:"#D2515E" },
    { name: "orange", hex:"#FF6C2F" },
    { name: "phosphorent pink", hex:"#FF48B0" },
    { name: "light gray", hex:"#88898A" },

    { name: "Coral", hex: "#FF8E91" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Aqua", hex: "#5EC8E5" },
    { name: "Mint", hex: "#82D8D5" },
    { name: "Fluorescent Yellow", hex: "#F7FF00" },
    { name: "Fluorescent Red", hex: "#FF4C65" },
    { name: "Fluorescent Green", hex: "#44D62C" },
    { name: "Wine", hex: "#914E72" },
    { name: "Dark Mauve", hex: "#BD8CA6" },
    { name: "Light Mauve", hex: "#E6B5C9" },
    { name: "Bubble Gum", hex: "#F984CA" },
    { name: "Bisque", hex: "#F2CDCF" },
    { name: "Mahogany", hex: "#8E595A" },
    { name: "Copper", hex: "#BD6439" },
    { name: "Bright Gold", hex: "#BA8032" },
    { name: "Bright Olive Green", hex: "#BA8032" },
    { name: "Pumkin", hex: "#FF6F4C" },
    { name: "Paprika", hex: "#EE7F4B" },
    { name: "Abricot", hex: "#F6A04D" },
    { name: "Melon", hex: "#FFAE3B" },
    { name: "Sunflower", hex: "#FFB511" },
    { name: "Light Lime", hex: "#E3ED55" },
    { name: "Brick", hex: "#A75154" },
    { name: "Rasberry Red", hex: "#B44B65" },
    { name: "Maroon", hex: "#9E4C6E" },
    { name: "Cranberry", hex: "#C24F5D" },
    { name: "Tomato", hex: "#D2515E" },
    { name: "Scarlet", hex: "#F65058" },
    { name: "Grape", hex: "#6C5D80" },
    { name: "Raisin", hex: "#775D7A" },
    { name: "Plum", hex: "#845991" },
    { name: "Orchid", hex: "#BB76CF" },
    { name: "Violet", hex: "#9D7AD2" },
    { name: "Lagoon", hex: "#2F6165" },
    { name: "Pine", hex: "#237E74" },
    { name: "Ivy", hex: "#169B62" },
    { name: "Light Teal", hex: "#009DA5" },
    { name: "Kelly Green", hex: "#67B346" },
    { name: "Sea Foam", hex: "#62C2B1" },
    { name: "Moss", hex: "#68724D" },
    { name: "Spruce", hex: "#4A635D" },
    { name: "Forest", hex: "#516E5A" },
    { name: "Grass", hex: "#397E58" },
    { name: "Esmerald", hex: "#19975D" },
    { name: "Turquoise", hex: "#00AA93" },
    { name: "Slate", hex: "#5E695E" },
    { name: "Steel", hex: "#375E77" },
    { name: "Smoky teal", hex: "#5F8289" },
    { name: "Charcoal", hex: "#70747C" },
    { name: "Granite", hex: "#A5AAA8" },
    { name: "Mist", hex: "#B8C7C4" },
    { name: "Midnight", hex: "#435060" },
    { name: "Indigo", hex: "#484D7A" },
    { name: "Lake", hex: "#235BA8" },
    { name: "Sea Blue", hex: "#0074A2" },
    { name: "Sky Blue", hex: "#4982CF" },
    { name: "Cornflower", hex: "#62A8E5" },
    { name: "Fluorescent Orange", hex: "#FF7477" },
    { name: "Crimson", hex: "#E45D50" },
    { name: "Metalic Gold", hex: "#AC936E" },
    { name: "Metalic Silver", hex: "#9C9C9C" },
    { name: "Gray", hex: "#928D88" },
]

export function findColorByName(colorName: string) : string {
    const color = palette.find(color => color.name === colorName);
    if(!color) {
        throw new Error(`Color named ${colorName} does not exist in the palette`);
    }
    return color.hex;
}


export const colorsPalette = palette.map(color => color.hex);
//more colors https://www.stencil.wiki/colors

export function sampleColor() : string {
    const colorsPalette = palette.map(color => color.hex);
    const chosenColor = sample(colorsPalette);
    if(!chosenColor) {
        return "#000000";
    }
    return chosenColor;
}