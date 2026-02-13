import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide the default header for all auth screens
      }}
    >
      {/* Login screen */}
      <Stack.Screen name="login" />

      {/* Register screen */}
      <Stack.Screen name="register" />

      {/* Optional: Forgot password */}
      <Stack.Screen name="forgotpassword" />
    </Stack>
  );
}
