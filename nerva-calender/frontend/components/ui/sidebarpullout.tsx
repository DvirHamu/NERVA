"use client";

import { useState } from "react";

export function SidebarPullout({ children }: { children: React.ReactNode }) {
    // Tracks whether the sidebar is expanded or collapsed
  const [open, setOpen] = useState(false);

  return (
    // Creates the horizontal layout
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {/* The width animation logic 
            ${open ? true : false}
      */}
      <div
        className={`
          transition-all duration-300 bg-gray-200 text-white
          ${open ? "w-1/3" : "w-16"}
          pt-14
          rounded-r-xl
        `}
      >
        <button
          className="p-4"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>

        {/* Sidebar only appears when the button is pressed 
            Contains contents of the sidebar insides
        */}
        {open && (
          <nav className="mt-4 flex flex-col space-y-2">
            <a href="#" className="hover:text-blue-400 px-4 py-2">Home</a>
            <a href="#" className="hover:text-blue-400 px-4 py-2">Settings</a>
            <a href="#" className="hover:text-blue-400 px-4 py-2">Profile</a>
          </nav>
        )}
      </div>

      {/* Main content area 
          Contains the AI viewport
      */}

      <div
        className={`
          transition-all duration-300 flex-1
          ${open ? "ml-16" : "ml-16"}
          flex item-center justify-center
        `}
      >
        {children}
      </div>
    </div>
  );
}
