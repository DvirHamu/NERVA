"use client";
import { useState } from "react";

type ToggleSwitchProps = {
  initialState?: boolean;
  onToggle?: (checked: boolean) => void;
};

export function ToggleSwitch({
  initialState = false,
  onToggle,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(initialState);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <div className="flex items-center space-x-3 select-none">
      <button
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
          isChecked ? "bg-secondary-foreground" : "bg-background"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] h-6 w-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isChecked ? "bg-background translate-x-5" : "bg-secondary-foreground translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
}
