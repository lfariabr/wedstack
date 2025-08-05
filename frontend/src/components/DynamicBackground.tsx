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
    default:
      return "url('/wedding-ring.svg')";
  }
};

export default function DynamicBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: setPageBackgroundAccordingToPage(pathname),
        backgroundRepeat: "repeat",
        backgroundSize: "120px",
        backgroundPosition: "top left",
      }}
    >
      {children}
    </div>
  );
}
