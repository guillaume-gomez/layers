import React, { useState, useCallback } from 'react';
import { throttle } from "lodash";
import ClickAwayListener from 'react-click-away-listener';
import { palette, findColorByName } from "./palette";

const COLORS = palette;

const IN_BLACK :string[] = [
  findColorByName("white"),
  findColorByName("yellow"),
  findColorByName("teal"),
  findColorByName("Mist"),
  findColorByName("Fluorescent Yellow"),
  findColorByName("Light Lime"),
];

interface ColorPickerInterface {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({label, value, onChange} : ColorPickerInterface) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [iconColorClass, setIconColorClass] = useState<string>("text-white");

  const throttleOnChangeInputColor = useCallback(throttle(onChangeInputColor, 500), []);

  function selectColor(color: string) {
    onChange(color);
    if (IN_BLACK.includes(color)) {
      setIconColorClass("text-black");
    }
    else {
      setIconColorClass("text-white");
    }
  }

  function onChangeInputColor(color: string) {
    selectColor(color);
  }



  function handleClickAway() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <div>
        <label className="block mb-1 text-base font-semibold">{label}</label>
        <div className="flex flex-row relative">
          <input id="color-picker" disabled className="w-full border border-gray-400 p-2 rounded-lg text-white" value={value}  />
          <input type="color" className="absolute h-full w-10/12 opacity-0" value={value} onChange={(e) => throttleOnChangeInputColor(e.target.value) }/>
          <div
            onClick={()=> setIsOpen(!isOpen)}
            style={{background: value }}
            className={`cursor-pointer rounded-full ml-3 my-auto h-10 w-10 flex`}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${iconColorClass} h-6 w-6 mx-auto my-auto`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        {isOpen ?
          <ClickAwayListener onClickAway={handleClickAway}>
          <div style={{ zIndex: 4 }} className="overflow-y-scroll overflow-x-hidden h-36 border-2 border-gray-300 origin-top-right absolute right-0 top-full mt-2 rounded-md shadow-lg">
            <div className="rounded-md bg-base-200 shadow-xs p-3">
              <div className="grid grid-flow-row-dense grid-cols-5">
                {
                  COLORS.map(color =>
                    (
                      <div
                        style={{background: color.hex}}
                        onClick={()=> selectColor(color.hex)}
                        className={`cursor-pointer w-6 h-6 rounded-full mx-1 my-1`}>
                      </div>
                    )
                  )
                }
              </div>
            </div>
          </div>
          </ClickAwayListener>
          : null
        }
      </div>
    </div>
  );
}

export default ColorPicker;
