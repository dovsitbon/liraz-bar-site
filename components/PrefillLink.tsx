"use client";

import type { ReactNode } from "react";
import { prefillRequest, type Prefill } from "@/lib/quote";

/** Lien vers le formulaire qui pré-remplit aussi la formule choisie. */
export function PrefillLink({ prefill, className = "", children }: { prefill: Prefill; className?: string; children: ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        prefillRequest(prefill);
      }}
    >
      {children}
    </a>
  );
}
