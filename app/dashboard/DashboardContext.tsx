"use client";
import { createContext, useContext } from "react";
import type { PlanType } from "@/types";

interface DashboardCtx {
  user: { id?: string; name?: string | null; email?: string | null };
  plan: PlanType;
  projectCount: number;
}

export const DashboardContext = createContext<DashboardCtx>({
  user: {},
  plan: "FREE",
  projectCount: 0,
});

export const useDashboard = () => useContext(DashboardContext);
