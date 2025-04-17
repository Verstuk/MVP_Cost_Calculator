"use client";
// Import the dev tools and initialize them
import { useEffect } from "react";
import { TempoDevtools } from "tempo-devtools";

export function TempoInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO) {
      TempoDevtools.init();
    }
  }, []);

  return null;
}
