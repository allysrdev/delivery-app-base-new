"use client";

import { useEffect } from "react";
import { getUser } from "@/services/userService";
import { redirect } from "next/navigation";

export default function ClientAuthCheck({ email }: { email: string }) {
  useEffect(() => {
    async function checkUser() {
      if (email) {
        const user = await getUser(email);
        if (!user) {
          redirect("/signup");
        }
      }
    }

    checkUser();
  }, [email]);

  return null; // Não renderiza nada, apenas executa a lógica
}
