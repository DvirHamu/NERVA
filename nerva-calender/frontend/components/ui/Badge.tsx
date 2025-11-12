import Image from "next/image"

const badgeNameStyle = "text-foreground text-xl"
const badgeDescStyle = "text-foreground text-l"

export function Badge({imagePath, badgeName, badgeDescription, enableOpacity}:{imagePath: string, badgeName: string, badgeDescription: string, enableOpacity:number}){
    return(
        <div className={`flex items-center my-3 border-2 border-foreground p-3 rounded-3xl ${enableOpacity === 1 ? "opacity-100" : "opacity-50"}`}>
            <Image src={imagePath} alt="Badge" width={125} height={125} className="mr-7"/>
            <div className="flex flex-col justify-between">
                <p className={badgeNameStyle}>{badgeName}</p>
                <p className={badgeDescStyle}>{badgeDescription}</p>
            </div>
        </div>
    );
}