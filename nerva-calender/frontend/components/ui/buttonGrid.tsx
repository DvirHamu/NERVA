const buttonStyle = "bg-background hover:scale-103 text-foreground py-3 px-3 rounded transition"
const innerStyle = "flex justify-center items-center mx-3"


export function ButtonGrid(){
    return(
        <div className="grid gap-4 grid-cols-2 ml-4 mr-4 ">
            <button className={`${buttonStyle}`}>
                <div className={`${innerStyle}`}>
                    <p>Onyx</p>
                </div>
            </button>
            <button className={`${buttonStyle}`}>
                <div className={`${innerStyle}`}>
                    <p>Shimmer</p>
                </div>
            </button>
            <button className={`${buttonStyle}`}>
                <div className={`${innerStyle}`}>
                    <p>Nova</p>
                </div>
            </button>
            <button className={`${buttonStyle}`}>
                <div className={`${innerStyle}`}>
                    <p>Ash</p>
                </div>
            </button>
        </div>
    );
}