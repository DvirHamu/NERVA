import { useState, useRef, useEffect } from "react";

export function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState("1x"); // Default speed
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Speed options
  const speeds = ["0.5x", "1x", "1.5x", "2x"];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center gap-x-3 rounded bg-background px-3 py-2 text-sm text-foreground hover:scale-105 focus:outline-none">
        {speed}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded bg-white">
          <div className="py-1">
            {speeds.map((option) => (<button key={option} onClick={() => {setSpeed(option); setIsOpen(false);}} className={`block w-full text-left px-4 py-2 text-sm ${ option === speed ? "bg-secondary-foreground text-background font-medium" : "text-gray-700 hover:bg-gray-100"}`}>{option}</button>))}
          </div>
        </div>
      )}
    </div>
  );
}
