"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { RadioGroup } from "./radiobuttons";
import { ScalerController } from "./FixedSlider";
import localFont from "next/font/local";
import { ButtonGrid } from "./buttonGrid";
import { ToggleSwitch } from "./ToggleSwitch";
import { DropDown } from "./Dropdown";
import { Divider } from "./Divider";
import { Badge } from "./Badge";
import { ThemeRadioGroup } from "./ThemeProvider";
import FontRadioGroup from "./FontProvider";
import { TTSControls } from "./TTSControls";

type SidebarProps = {
  children: React.ReactNode;
};

const sidebarHeader = "text-foreground text-xl";
const sidebarSubheader = "text-foreground text-m ml-2 mt-4";
const sidebarOption = "text-foreground text-s ml-4";
const sidebarButton = "bg-secondary-foreground rounded-full p-4 hover:scale-110 translate";

const badgeButton = "bg-secondary-foreground rounded-full p-4 hover:scale-110 translate";

export function Sidebar({ children }: SidebarProps) {
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openBadges, setOpenBadges] = useState(false);
    const [openSettings, setOpenSetting] = useState(false);
    const isOpen = openCalendar || openBadges || openSettings;

    // Badges Enabled
    const [badgesEnabled, setBadgesEnable] = useState(true);

    // Font Weight Enabled
    const [boldEnabled, setBoldEnabled] = useState(false);

    useEffect(() => {
        if(boldEnabled){
            document.body.classList.add("font-bold");
        } else{
            document.body.classList.remove("font-bold");
        }
    }, [boldEnabled]);

  // Fixes body scroll issue from settings
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar Buttons */}
      <div className="flex flex-col justify-between bg-background w-16 py-4 items-center">
        {/* Nerva logo */}
        <div className="pt-0">
            <Image src="dark_logo.svg" alt="Logo" className="block dark:hidden" width={30} height={30} />
            <Image src="light_logo.svg" alt="Logo" className="hidden dark:block" width={30} height={30} />
        </div>

        {/* Calendar & Badge Buttons */}
        <div className="flex flex-col space-y-4">
          {/* Calendar Button */}
          <div>
            <button style={{ width: "3.5em", height: "3.5em" }} className="bg-secondary-foreground rounded-full p-4 hover:scale-110 translate block dark:hidden" onClick={() => {setOpenCalendar(!openCalendar); setOpenBadges(false); setOpenSetting(false);}}> {openCalendar ? (<Image src="/icons/light_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/light_calendar.svg" alt="Calendar" width={24} height={24}/>)}
            </button>
            <button style={{ width: "3.5em", height: "3.5em" }} className="bg-secondary-foreground rounded-full p-4 hover:scale-110 translate hidden dark:block" onClick={() => {setOpenCalendar(!openCalendar); setOpenBadges(false); setOpenSetting(false);}}> {openCalendar ? (<Image src="/icons/dark_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/dark_calendar.svg" alt="Calendar" width={24} height={24}/>)}
            </button>
          </div>

            {/* Badge Button */}
            <div>
              <button style={{ width: "3.5em", height: "3.5em" }} className={`bg-secondary-foreground rounded-full p-4 hover:scale-110 translate block dark:hidden ${badgesEnabled ? "visible" : "invisible"}`} onClick={() => {setOpenBadges(!openBadges); setOpenCalendar(false); setOpenSetting(false);}}>
                {openBadges ? (<Image src="/icons/light_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/light_badge.svg" alt="Badge" width={24} height={24}/>)}
              </button>
              <button style={{ width: "3.5em", height: "3.5em" }} className={`bg-secondary-foreground rounded-full p-4 hover:scale-110 translate hidden dark:block ${badgesEnabled ? "visible" : "invisible"}`} onClick={() => {setOpenBadges(!openBadges); setOpenCalendar(false); setOpenSetting(false);}}>
                {openBadges ? (<Image src="/icons/dark_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/dark_badge.svg" alt="Badge" width={24} height={24}/>)}
              </button>
            </div>
        </div>

        {/* Settings Button */}
        <div className="pb-2">
          <button style={{ width: "3.5em", height: "3.5em" }} className="bg-secondary-foreground rounded-full p-4 hover:scale-110 translate block dark:hidden" onClick={() => {setOpenSetting(!openSettings); setOpenCalendar(false); setOpenBadges(false);}}>
            {openSettings ? (<Image src="/icons/light_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/light_settings.svg" alt="Settings" width={24} height={24} />)}
          </button>
          <button style={{ width: "3.5em", height: "3.5em" }} className="bg-secondary-foreground rounded-full p-4 hover:scale-110 translate hidden dark:block" onClick={() => {setOpenSetting(!openSettings); setOpenCalendar(false); setOpenBadges(false);}}>
            {openSettings ? (<Image src="/icons/dark_cross.svg" alt="Close" width={24} height={24} />) : (<Image src="/icons/dark_settings.svg" alt="Settings" width={24} height={24} />)}
          </button>
        </div>
      </div>

      {/* Pullout Sidebar */}
      <div className={`transition-all duration-300 bg-secondary ground text-black rounded-r-xl ${isOpen ? (openCalendar ? "w-2/3" : "w-1/4") : "w-0"} h-screen overflow-hidden`}>
        {/* Inner Scroll Container */}
        <div className="h-full overflow-y-auto p-4">
          {/* Calendar */}
          {openCalendar && (
            <div className="h-full">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=dhamu%40asu.edu&ctz=America%2FPhoenix"
                className="w-full h-full border-0 rounded-lg"
              ></iframe>
            </div>
          )}

          {/* Badges */}
          {openBadges && (
            <nav className="flex flex-col space-y-2">
              <p className={sidebarHeader}>Badges</p>
              <Divider />
              <Badge imagePath="badges/bird.svg" badgeName="Early Bird" badgeDescription="Start a task before 9AM" enableOpacity={1}/>
              <Badge imagePath="badges/calendar.svg" badgeName="Planning Pro" badgeDescription="Fully schedule a week" enableOpacity={0}/>
              <Badge imagePath="badges/tasks.svg" badgeName="Task Master" badgeDescription="Complete 10 tasks" enableOpacity={0}/>
              <Badge imagePath="badges/fire.svg" badgeName="Consistency Champion" badgeDescription="Stay active for 30 days" enableOpacity={0}/>
              <Badge imagePath="badges/light_bulb.svg" badgeName="Breakthrough" badgeDescription="Complete a big project" enableOpacity={0}/>
            </nav>
          )}

          {/* Settings */}
          {openSettings && (
            <nav className="flex flex-col space-y-2">
              <p className={sidebarHeader}>Settings</p>
              <Divider />
                {/* Appearance */}
              <p className={sidebarSubheader}>Appearance</p>
              <p className={sidebarOption}>Theme</p>
              <ThemeRadioGroup/>

              <p className={sidebarOption}>Font</p>
              <FontRadioGroup/>

              <div className="flex justify-between items-center my-2">
                <p className={sidebarOption}>View Scale</p>
                <ScalerController/>
              </div>

              <div className="flex justify-between items-center mr-4 mt-2">
                <p className={sidebarOption}>Enable Font Boldness</p>
                <ToggleSwitch initialState={boldEnabled} onToggle={(checked) => setBoldEnabled(checked)} />
              </div>
            <Divider />

                {/* AI Voice Options */}
              <p className={sidebarSubheader}>AI Voice</p>
              <TTSControls/>
              <Divider />

                {/* Gamification */}
              <p className={sidebarSubheader}>Gamification</p>
              <div className="flex justify-between items-center mr-4">
                <p className={sidebarOption}>Enable Badges</p>
                <ToggleSwitch initialState={true} onToggle={(checked) => setBadgesEnable(checked)}/>
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${isOpen ? (openCalendar ? "ml-0" : "ml-16") : "ml-0"} flex items-center justify-center`}>
        {children}
      </div>
    </div>
  );
}
