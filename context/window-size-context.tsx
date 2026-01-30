"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WindowSize {
  width: number;
  height: number;
}

const WindowSizeContext = createContext<WindowSize>({ width: 0, height: 0 });

function getWindowDimensions(): WindowSize {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function WindowSizeProvider({ children }: { children: ReactNode }) {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowDimensions());
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export function useWindowSize() {
  return useContext(WindowSizeContext);
}
