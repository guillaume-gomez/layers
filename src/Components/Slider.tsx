import React from 'react';

interface SliderProps {
  onChange: (value: number) => void;
  value: number;
  label: string;
  min: number;
  max: number;
  disabled?: boolean;
  float?: boolean;
  step?: number;
}

function Slider({ 
  value,
  onChange,
  label,
  min,
  max,
  disabled = false,
  float = false,
  step = 1
} : SliderProps ) {
  return (
    <div className="flex flex-col">
      <label className="flex flex-row items-center gap-2">
        {label}
        <div className="badge badge-accent">{value}</div>
      </label>
      <input
          disabled={disabled}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const newValue = float ? parseFloat(e.target.value) : parseInt(e.target.value);
            onChange(newValue);
          }}
          className="range range-primary"
        />
    </div>
  );
}

export default Slider;