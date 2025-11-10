import useLogin from "@/hooks/useLogin"; // adjust path
import useSignup from "@/hooks/useSignup"; // adjust path
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const router = useRouter();
  const { signup, passError } = useSignup();
  const { login } = useLogin();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signup({ fullName: "", email, pass }); // fullName not used
      if (result === "confirm") {
        alert("Signup successful! Please check your email to confirm.");
        router.replace("/login"); // redirect after signup
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await login({ email, pass });
      if (user) {
        alert("Login successful!");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      {(passError || error) && (
        <Text style={styles.error}>{passError || error}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.buttons}>
          <Button
            title={isLogin ? "Login" : "Sign Up"}
            onPress={isLogin ? handleLogin : handleSignup}
          />
          <View style={{ height: 10 }} />
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  buttons: {
    marginTop: 10,
    alignItems: "center",
  },
  toggleText: {
    color: "#0066cc",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
