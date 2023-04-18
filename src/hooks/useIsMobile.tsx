import { useEffect, useState } from "react";

// hook that returns true if the screen is mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    setIsMobile(document.body.clientWidth < 768);
    () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};
