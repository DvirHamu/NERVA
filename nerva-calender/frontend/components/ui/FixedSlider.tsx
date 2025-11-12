"user client";
import {useState, useEffect} from "react";

export function ScalerController() {
  const [scale, setScale] = useState(1);

  const selectedScale = "s";
  
    useEffect(() => {
    document.documentElement.style.setProperty("--scale", scale.toString());
  }, [scale]);

  function setSmallScale(){
    setScale(s => 1);
  }

  function setMediumScale(){
    setScale(s => 1.25);
  }

  function setLargeScale(){
    setScale(s => 1.5);
  }

  function setXLargeScale(){
    setScale(s => 1.75);
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--scale", scale.toString());
  }, [scale]);

  return (
    <div className="w-1/2 ml-2 mt-3 mr-4">
      {/* Points for Font Sizes */}
      <div className="relative flex justify-between">
        <button onClick={setSmallScale} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${scale === 1 ? "bg-secondary-foreground text-background" : "bg-background text-foreground"}`}>S</button>
        <button onClick={setMediumScale} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${scale === 1.25 ? "bg-secondary-foreground text-background" : "bg-background text-foreground"}`}>M</button>
        <button onClick={setLargeScale} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${scale === 1.5 ? "bg-secondary-foreground text-background" : "bg-background text-foreground"}`}>L</button>
        <button onClick={setXLargeScale} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${scale === 1.75 ? "bg-secondary-foreground text-background" : "bg-background text-foreground"}`}>XL</button>
      </div>
    </div>
  );
}