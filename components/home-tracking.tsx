"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function HomeTracking() {
  useEffect(() => {
    track("home_opened");
  }, []);

  return null;
}
