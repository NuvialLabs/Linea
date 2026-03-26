import { COLORS } from "@/global/constants";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, Dispatch, SetStateAction } from "react";

const ColorInput = ({
  setColors,
}: {
  setColors: Dispatch<SetStateAction<string[]>>;
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleAddColor = () => {
    colorInputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setColors((prev) => {
      if (prev.includes(val)) return prev;

      if (prev.length == COLORS.length) {
        return [...prev, val];
      }

      return [...prev.filter((_, index) => index < COLORS.length), val];
    });
  };
  return (
    <div className="relative">
      <input
        ref={colorInputRef}
        type="color"
        className="absolute inset-0 opacity-0"
        onChange={handleColorChange}
      />
      <button
        type="button"
        onClick={handleAddColor}
        className="text-white w-4 h-4"
      >
        <PlusCircleIcon />
      </button>
    </div>
  );
};

export default ColorInput;
