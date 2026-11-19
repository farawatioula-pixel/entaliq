"use client";

import { useEffect } from "react";
import { captureSource } from "@/lib/source";

/**
 * Records where the visitor came from on the first page they land on.
 * Mounted in the layout so it runs whether they arrive on the home page,
 * /register, or a shared card link.
 */
export default function SourceCapture() {
  useEffect(() => {
    captureSource();
  }, []);

  return null;
}
