'use client';
import { useState, useEffect } from "react";

export default function FontRadioGroup(){
    const [font, setFont] = useState<'lexend' | 'arial' | 'helvetica' | 'comic'>('arial');

    // Sets the font for the body
    useEffect(() => {
        document.body.classList.remove('font-arial', 'font-lexend', 'font-helvetica', 'font-comic');
        document.body.classList.add(`font-${font}`);
    }, [font]);

    return(
        <div>
            <div className="flex flex-col ml-2">
                <label key="Light" className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => setFont('arial')}>
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition bg-background`}>
                        {font === 'arial' &&(
                        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                        )}
                    </div>
                    <span className="text-sm font-arial font-medium text-foreground">Arial</span>
                </label>
            </div>
            <div className="flex flex-col ml-2">
                <label key="Light" className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => setFont('comic')}>
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition bg-background`}>
                        {font === 'comic' &&(
                        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                        )}
                    </div>
                    <span className="text-sm font-comic font-medium text-foreground">Comic Sans</span>
                </label>
            </div>
            <div className="flex flex-col ml-2">
                <label key="Light" className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => setFont('lexend')}>
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition bg-background`}>
                        {font === 'lexend' &&(
                        <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                        )}
                    </div>
                    <span className="text-sm font-lexend font-medium text-foreground">Lexend</span>
                </label>
            </div>
        </div>
    )
}