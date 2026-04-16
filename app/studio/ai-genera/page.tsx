"use client";

import { useEffect } from "react";

export default function AIGeneraPage() {
  useEffect(() => {
    window.location.href = "/studio/ai-genera/editor";
  }, []);

  return null;
}
