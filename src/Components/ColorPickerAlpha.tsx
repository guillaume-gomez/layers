import React, { useState } from 'react';
import Slider from "./Slider";
import ColorPicker from "./ColorPicker";
import { fromRGBToRGBA } from "../colorConverterTools";

function splitInTwo(str : string, index : number) : [string, number] {
  const [rgb, alpha] = [str.slice(0, index), str.slice(index)];
  return [rgb, Number(`0x${alpha}`)];
}


interface ColorPickerInterface {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPickerAlpha({label, value, onChange} : ColorPickerInterface) {
  const [rgb, alpha] = splitInTwo(value,7);

  function selectColor(color: string, alpha: number) {
    onChange(fromRGBToRGBA(color, alpha));
  }

  return (
    <div className="border">
      <ColorPicker
        label="Color"
        value={rgb}
        onChange={(rgb) => selectColor(rgb, alpha)}
      />
      <Slider
          label="Alpha"
          onChange={(value) => selectColor(rgb, value)}
          value={alpha}
          min={0}
          max={255}
        />

    </div>
  );
}

export default ColorPickerAlpha;
