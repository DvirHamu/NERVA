import { useState, useEffect } from "react";

const buttonStyle = "bg-background hover:scale-103 text-foreground py-3 px-3 rounded transition"
const innerStyle = "flex justify-center items-center mx-3"
const sidebarOption= "text-foreground text-s ml-4";

export function TTSControls(){
    const [config, setConfig] = useState({ voice : "Onyx"});
    const [speed, setSpeed] = useState({ speed : 1.0 })

    useEffect(() => {
    fetch("http://localhost:5000/get_tts")
        .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
        })
        .then((data) => {
        console.log("Fetched config:", data);
        setConfig(data);
        })
        .catch((err) => console.error("Error fetching TTS config:", err));
    }, []);


    const updateConfig = async (ui_data) => {
        console.log("Sending Update: ", ui_data);
        const response = await fetch("http://localhost:5000/update_tts", {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(ui_data),
        });

        console.log("Response Object: ", response);
        const data = await response.json();
        console.log("Response JSON: ", data);
        setConfig(data.new_config);
    };

    return(
        <div>
            {/* AI Voice Button Grid */}
            <p className={sidebarOption}>Voice Options</p>
            <div className="grid gap-4 grid-cols-2 ml-4 mr-4 ">
                <button className={`${buttonStyle}`} onClick={() => updateConfig({ voice: "onyx"})}>
                    <div className={`${innerStyle}`}>
                        <p>Onyx</p>
                    </div>
                </button>
                <button className={`${buttonStyle}`} onClick={() => updateConfig({ voice: "shimmer"})}>
                    <div className={`${innerStyle}`}>
                        <p>Shimmer</p>
                    </div>
                </button>
                <button className={`${buttonStyle}`} onClick={() => updateConfig({ voice: "nova"})}>
                    <div className={`${innerStyle}`}>
                        <p>Nova</p>
                    </div>
                </button>
                <button className={`${buttonStyle}`} onClick={() => updateConfig({ voice: "ash"})}>
                    <div className={`${innerStyle}`}>
                        <p>Ash</p>
                    </div>
                </button>
            </div>

            {/* Voice Speed */}
            <div className="flex justify-between items-center my-2">
                <p className={sidebarOption}>Voice Speed</p>
                <div className="w-1/2 ml-2 mt-3 mr-4">
                    {/* Points for Font Sizes */}
                    <div className="relative flex justify-between">
                        <button onClick={() => updateConfig({ speed: 0.75 })} className={`w-23 h-9 ml-3 rounded-full border-2 flex items-center justify-center transition}`}>0.5x</button>
                        <button onClick={() => updateConfig({ speed: 1.0 })} className={`w-23 h-9 ml-3 rounded-full border-2 flex items-center justify-center transition`}>1.0x</button>
                        <button onClick={() => updateConfig({ speed: 1.5 })} className={`w-23 h-9 ml-3 rounded-full border-2 flex items-center justify-center transition`}>1.5x</button>
                        <button onClick={() => updateConfig({ speed: 2.0 })} className={`w-23 h-9 ml-3 rounded-full border-2 flex items-center justify-center transition`}>2.0x</button>
                    </div>
                </div>
            </div>
        </div>
    );
}