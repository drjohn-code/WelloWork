"use client";

import { useEffect } from "react";
import { clearOrderDraft } from "./orderDraft";

/** Rendered only in the paid confirmation state: the order is done, so drop the saved wizard draft. */
export function ClearOrderDraft() {
  useEffect(() => {
    clearOrderDraft();
  }, []);
  return null;
}
