import { useUserStore } from "@/globalStore/userSotre";
import { supabase } from "@/util/supabase";
import { useState } from "react";

interface SignupData {
  fullName: string;
  email: string;
  pass: string;
}

export default function useSignup() {
  const [passError, setPassError] = useState<string | null>(null);
  const { setUser } = useUserStore();

  const signup = async ({ fullName, email, pass }: SignupData) => {
    setPassError(null);

    if (pass.length < 6) {
      setPassError("Password must be at least 6 characters long");
      throw new Error("Password too short");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    if (error) {
      console.error("Auth signup error:", error.message);
      throw error;
    }

    if (data.user && !data.session) {
      console.log("✅ Signup successful. Please check your email to confirm.");
      return "confirm"; // email verification required
    }

    if (data.user && data.session) {
      setUser(data.user.id, data.user.email!);
      console.log("✅ Signup successful and signed in.");
      return "signedIn";
    }

    throw new Error("Signup failed. Email may already be registered.");
  };

  return { signup, passError };
}
