"use client";

import { useEffect } from "react";
import { recordContactIntent } from "@/lib/measurement";

export function ContactMeasurement() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      const href = anchor?.getAttribute("href") || "";
      if (href.startsWith("mailto:")) recordContactIntent("email");
      else if (href.startsWith("tel:")) recordContactIntent("phone");
      else if (anchor?.dataset.contactMethod === "booking") recordContactIntent("booking");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
