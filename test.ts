import { ref, set } from "firebase/database";
import { database } from "@/services/firebase";

export const testFirebaseWrite = async () => {
  try {
    await set(ref(database, "test_user"), {
      name: "Teste",
      phone: "(11) 99999-9999",
      createdAt: new Date().toISOString(),
    });
    console.log("Dados enviados com sucesso!");
  } catch (error) {
    console.error("Erro ao escrever no Firebase:", error);
  }
};
