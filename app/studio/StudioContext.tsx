"use client";
import { createContext, useContext } from "react";
import type { PlanType } from "@/types";

interface StudioCtx {
  user: { id?: string; name?: string | null; email?: string | null };
  plan: PlanType;
  projectCount: number;
}

export const StudioContext = createContext<StudioCtx>({
  user: {},
  plan: "FREE",
  projectCount: 0,
});

export const useStudio = () => useContext(StudioContext);
