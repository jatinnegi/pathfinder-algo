import React, { useEffect, useState } from "react";

import CaretIcon from "src/icons/Caret";

interface Props {
  selectedValue: string;
  setSelectedValue: (key: string) => void;
  options: { [key: string]: string };
}

const Dropdown: React.FC<Props> = ({
  selectedValue,
  setSelectedValue,
  options,
}) => {
  useEffect(() => {
    document.addEventListener("click", () => {
      setDisplayOptions(false);
    });

    return () => {
      document.addEventListener("click", () => {
        setDisplayOptions(false);
      });
    };
  }, []);

  const [displayOptions, setDisplayOptions] = useState<boolean>(false);

  const getShort = (algo: string) => {
    const MAX = 8;

    if (algo.length <= MAX) return algo;

    return `${algo.substring(0, MAX)}...`;
  };

  return (
    <button
      id="algo-options"
      className={`h-full w-full relative py-2 ${
        displayOptions ? "bg-green-500" : "bg-gray-700"
      }`}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDisplayOptions(!displayOptions);
      }}
    >
      <div className="px-2 w-full flex items-center justify-between">
        <p className="hidden lg:block text-white font-medium text-base">
          {options[selectedValue]}
        </p>
        <p className="lg:hidden text-white font-medium text-sm">
          {getShort(options[selectedValue])}
        </p>
        <div className="h-3 w-3 text-white">
          <CaretIcon />
        </div>
      </div>
      {displayOptions && (
        <ul
          className="absolute bg-gray-700 text-white rounded-sm
        text-left drop-shadow-lg text-sm overflow-hidden z-50"
          style={{
            width: "100%",
            minWidth: "200px",
            bottom: "-201%",
          }}
        >
          {Object.keys(options).map((key: string) => (
            <li
              key={key}
              className="py-2 px-4 hover:bg-gray-600 font-medium text-xs lg:text-sm"
              onClick={() => {
                setSelectedValue(key);
              }}
            >
              {options[key]}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
};

export default Dropdown;
