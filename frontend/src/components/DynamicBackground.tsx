"use client";

import { usePathname } from "next/navigation";

const setPageBackgroundAccordingToPage = (page: string) => {
  switch (page) {
    case "/details":
      return "url('/opera-pattern.svg')";
    case "/menu":
      return "url('/food-menu.svg')";
    case "/message":
      return "url('/love-letter.svg')";
    case "/gifts":
      return "url('/gift-box.svg')";
    case "/confirmation":
      return "url('/confirmation-yes.svg')";
    default:
      return "url('/wedding-ring.svg')";
  }
};

const getBackgroundSettings = (page: string) => {
  switch (page) {
    case "/details":
    case "/menu":
    case "/message":
    case "/gifts":
    case "/confirmation":
      return {
        backgroundRepeat: "repeat",
        backgroundSize: "120px",
        backgroundPosition: "top left",
        opacity: 0.1
      };
    default:
      // Homepage - more subtle wedding rings
      return {
        backgroundRepeat: "repeat",
        backgroundSize: "200px", // Larger, less dense
        backgroundPosition: "center",
        opacity: 0.03 // Much more subtle
      };
  }
};

export default function DynamicBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const backgroundSettings = getBackgroundSettings(pathname);
  
  return (
    <div className="min-h-screen relative">
      {/* Background layer with opacity control */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: setPageBackgroundAccordingToPage(pathname),
          backgroundRepeat: backgroundSettings.backgroundRepeat,
          backgroundSize: backgroundSettings.backgroundSize,
          backgroundPosition: backgroundSettings.backgroundPosition,
          opacity: backgroundSettings.opacity,
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
