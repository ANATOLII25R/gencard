import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export type PlanType = "FREE" | "PRO" | "BUSINESS";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  canvasData: string | null;
  width: number;
  height: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: string;
  stripeCurrentPeriodEnd?: Date;
}

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "background";
  data: Record<string, unknown>;
}

export interface FabricCanvasData {
  version: string;
  objects: Record<string, unknown>[];
  background?: string;
}
