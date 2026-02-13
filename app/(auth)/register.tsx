import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Email validation regex
  const validateEmail = (email: string) => {
    if (!email) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email)
      ? { ok: true, message: "Email looks good" }
      : { ok: false, message: "Invalid email" };
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) return null;
    const isLongEnough = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return isLongEnough && hasNumber
      ? { ok: true, message: "Password is good" }
      : { ok: false, message: "Password must be 8+ chars and include at least 1 number" };
  };

  const emailStatus = validateEmail(email);
  const passwordStatus = validatePassword(password);

  const confirmStatus =
    confirmPassword.length === 0
      ? null
      : password === confirmPassword
      ? { ok: true, message: "Passwords match" }
      : { ok: false, message: "Passwords do not match" };

  const handleSignUp = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) return;
    if (!emailStatus?.ok || !passwordStatus?.ok || !confirmStatus?.ok) return;

    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary px-6 justify-center"
    >
      <Text className="text-white text-3xl font-bold mb-10 text-center">Create Account</Text>

      {/* Email */}
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mt-3">
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Live email feedback */}
      {emailStatus && (
        <Text className={`mt-2 ml-2 text-sm ${emailStatus.ok ? "text-green-400" : "text-red-500"}`}>
          {emailStatus.ok ? "✅ " : "❌ "}
          {emailStatus.message}
        </Text>
      )}

      {/* Password */}
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mt-3">
        <TextInput
          secureTextEntry={!showPassword}
          placeholder="Password"
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white"
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#AB8BFF"
            />
        </Pressable>
      </View>

      {/* Live password feedback */}
      {passwordStatus && (
        <Text className={`mt-2 ml-2 text-sm ${passwordStatus.ok ? "text-green-400" : "text-red-500"}`}>
          {passwordStatus.ok ? "✅ " : "❌ "}
          {passwordStatus.message}
        </Text>
      )}

      {/* Confirm Password */}
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mt-5">
        <TextInput
          secureTextEntry={!showConfirm}
          placeholder="Confirm Password"
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
            name={showConfirm ? "eye-off" : "eye"}
            size={20}
            color="#AB8BFF"
            />
        </Pressable>
      </View>

      {/* Live confirm feedback */}
      {confirmStatus && (
        <Text className={`mt-2 ml-2 text-sm ${confirmStatus.ok ? "text-green-400" : "text-red-500"}`}>
          {confirmStatus.ok ? "✅ " : "❌ "}
          {confirmStatus.message}
        </Text>
      )}

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignUp}
        className="bg-accent py-3.5 rounded-lg flex flex-row items-center justify-center mt-8"
      >
        <Text className="text-white font-semibold text-base">Sign Up</Text>
      </TouchableOpacity>

      {/* Login link */}
      <Pressable onPress={() => router.replace("/(auth)/login")} className="items-center mt-5">
        <Text className="text-sm text-gray-400">
          Already have an account? <Text className="text-[#AB8BFF] font-semibold">Log in</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
