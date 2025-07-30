"use client";

import { usePathname } from "next/navigation";

const setPageBackgroundAccordingToPage = (page: string) => {
  switch (page) {
    case "/details":
      return "url('/opera-pattern.svg')";
    case "/menu":
      return "url('/wedding-ring.svg')";
    case "/message":
      return "url('/wedding-ring.svg')";
    case "/gift":
      return "url('/wedding-ring.svg')";
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
