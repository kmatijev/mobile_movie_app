import { auth } from "@/services/firebase"; // your firebase.ts
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Glow animation for the button
  const resetGlow = useRef(new Animated.Value(0)).current;

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const isEmailValid = validateEmail(email);

  const handlePasswordReset = () => {
    if (!isEmailValid || sent) return;

    setSent(true);
    setError("");

    // Start glow animation like "Register now!"
    Animated.loop(
      Animated.sequence([
        Animated.timing(resetGlow, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(resetGlow, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Send password reset email via Firebase
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Auto redirect after short delay
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 1800);
      })
      .catch((err) => {
        console.log("Firebase reset error:", err.message);
        setSent(false);
        setError(err.message);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary px-6 justify-center"
    >
      <Text className="text-white text-3xl font-bold mb-4 text-center">
        Reset Password
      </Text>
      <Text className="text-gray-400 text-sm text-center mb-10">
        Enter your email and we’ll send you a reset link
      </Text>

      {/* Email input */}
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!sent}
        />
      </View>

      {/* Live email feedback */}
      {!sent && email.length > 0 && (
        <Text
          className={`mt-2 ml-2 text-sm ${
            isEmailValid ? "text-green-400" : "text-red-400"
          }`}
        >
          {isEmailValid ? "✅ Valid email" : "❌ Invalid email"}
        </Text>
      )}

      {/* Firebase error */}
      {!sent && error.length > 0 && (
        <Text className="mt-2 ml-2 text-red-400 text-sm">{error}</Text>
      )}

      {/* Animated glow button */}
      <Animated.View
        style={{
          transform: [
            {
              scale: resetGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
          opacity: resetGlow.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.9],
          }),
        }}
      >
        <TouchableOpacity
          onPress={handlePasswordReset}
          disabled={!isEmailValid || sent}
          className="bg-accent rounded-lg py-3.5 mt-8"
        >
          <Text className="text-white font-semibold text-base text-center">
            {sent ? "Password reset link sent" : "Send reset link"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
