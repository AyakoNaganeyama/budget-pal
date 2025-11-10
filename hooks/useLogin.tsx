import { supabase } from "@/util/supabase";
import { useState } from "react";

interface LoginData {
  email: string;
  pass: string;
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, pass }: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        console.error("Login failed:", error.message);
        setError(error.message);
        throw error;
      }

      if (!data.user) {
        setError("User not found");
        throw new Error("User not found");
      }

      console.log("✅ Login successful for:", email);
      return data.user; // return the user object
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
