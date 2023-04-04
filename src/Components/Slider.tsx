import React, { useState } from 'react';

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
  const [isEdit, setIsEdit] = useState<boolean>(false);

  function handleChange(e : any) {
    const newValue = float ? parseFloat(e.target.value) : parseInt(e.target.value);
    if(newValue < min) {
      onChange(min);
      return;
    }

    if(newValue > max) {
      onChange(max);
      return;
    }

    onChange(newValue);
  }

  return (
    <div className="flex flex-col">
      <label className="flex flex-row items-center gap-2">
        {label}
        <div className="btn btn-primary btn-xs badge badge-accent">
          {
            isEdit ?
              <input className="w-10" type="number" value={value} onBlur={() => setIsEdit(false)} onChange={handleChange}/> :
              <span className="w-full" onClick={() => setIsEdit(true)}>{value}</span>
          }
        </div>
      </label>
      <input
          disabled={disabled}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="range range-primary"
        />
    </div>
  );
}

export default Slider;