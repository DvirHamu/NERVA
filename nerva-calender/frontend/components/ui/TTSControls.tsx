import { useState, useEffect } from "react";

const buttonStyle = "hover:scale-103 py-3 px-3 rounded transition"
const innerStyle = "flex justify-center items-center mx-3"
const sidebarOption= "text-foreground text-s ml-4";

export function TTSControls(){
    const [ai_voice, updateVoice] = useState("nova");
    const [ai_speed, updateSpeed] = useState(1);
    /* useEffect(() => {
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
    }, []); */


    /* const updateConfig = async (ui_data: Partial<typeof config>) => {
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
    }; */

    return(
        <div>
            {/* --- AI Voice Button Grid --- */}
            <p className={sidebarOption}>Voice Options</p>
            <div className="grid gap-4 grid-cols-2 ml-4 mr-4 mt-3">
                {["onyx", "shimmer", "nova", "ash"].map((voice) => (
                <button
                    key={voice}
                    className={`${buttonStyle} ${
                    voice === ai_voice ? "bg-secondary-foreground text-background" : "bg-background text-foreground"
                    }`}
                    onClick={() => updateVoice(voice)}
                >
                    <div className={innerStyle}>
                    <p className="capitalize">{voice}</p>
                    </div>
                </button>
                ))}
            </div>

            {/* Voice Speed */}
             <div className="flex justify-between items-center my-2 mt-3">
                <p className={sidebarOption}>Voice Speed</p>
                <div className="w-2/3">
                    <div className="relative flex justify-between">
                        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => updateSpeed(speed)}
                            className={`w-11 h-11 mx-1 rounded-4xl border-2 flex items-center justify-center transition hover:scale-110 ${
                            speed === ai_speed ? "bg-secondary-foreground text-background" : "bg-background text-foreground"
                            }`}
                        >
                            {speed}x
                        </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}