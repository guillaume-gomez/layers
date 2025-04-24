import React, { useState, useEffect } from 'react';


interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
}

function RangeSlider({ min, max, step = 100 }: RangeSliderProps) {
    const [minPrice, setMinPrice] = useState<number>(min);
    const [maxPrice, setMaxPrice] = useState<number>(max);

    // the percentage on the right
    const [minThumb, setMinThumb] = useState<number>(0);
    // the percentage on the left
    const [maxThumb, setMaxThumb] = useState<number>(0);

    useEffect(() => {
        const newMinThumb = ((minPrice - min) / (max - min)) * 100;
        setMinThumb(newMinThumb);
    }, [minPrice]);

    useEffect(() => {
        const newMaxThumb = 100 - (((maxPrice - min) / (max - min)) * 100);
        setMaxThumb(newMaxThumb);
    }, [maxPrice]);

    //console.log(minThumb, "--> ", maxThumb)

    return (
    <div>
        <div>
          {/*<input type="range"
                 step={step}
                 min={min}
                 max={max}
                 //onBlur={minTrigger}
                 onChange={(e) => setMinPrice(parseInt(e.target.value))}
                 value={minPrice}
                 className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer" />

          <input type="range"
                 step={step}
                 min={min}
                 max={max}
                 //onBlur={maxTrigger}
                 onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                 value={maxPrice}
                 className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"/>*/}

            <input type="range"
                 step={step}
                 min={min}
                 max={max}
                 //onBlur={minTrigger}
                 onChange={(e) => setMinPrice(parseInt(e.target.value))}
                 value={minPrice}
                 className="absolute  z-20 h-2 w-full cursor-pointer" />

          <input type="range"
                 step={step}
                 min={min}
                 max={max}
                 //onBlur={maxTrigger}
                 onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                 value={maxPrice}
                 className="absolute  z-20 h-2 w-full cursor-pointer"/>
          <div className="relative z-10 h-2">

            <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200"></div>

            <div className="absolute z-20 top-0 bottom-0 rounded-md bg-green-300"
                style={{right: `${maxThumb}%`, left: `${minThumb}%` }}
            ></div>

            <div className="absolute z-30 w-6 h-6 top-0 left-0 bg-green-300 rounded-full -mt-2 -ml-1"
                style={{left: `${minThumb}%` }}
            ></div>

            <div className="absolute z-30 w-6 h-6 top-0 right-0 bg-green-300 rounded-full -mt-2 -mr-3"
                style={{right: `${maxThumb}%` }}
            ></div>

          </div>

        </div>

    <div className="flex justify-between items-center py-5">
      <div>
        <input
            type="number"
            maxLength={5}
            onChange={(e) => setMinPrice(parseInt(e.target.value))}
            value={minPrice}
            className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
        />
      </div>
      <div>
        <input
            type="number"
            maxLength={5}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            value={maxPrice}
            className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
        />
      </div>
    </div>

    </div>

  )
}

export default RangeSlider;

