"use server";

import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string || "Utente";

  if (!email || !password) {
    return { error: "Email e password sono obbligatori" };
  }

  if (password.length < 6) {
    return { error: "La password deve avere almeno 6 caratteri" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "L'email è già in uso. Prova ad accedere." };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error?.message || "Errore sconosciuto durante la registrazione." };
  }
}
