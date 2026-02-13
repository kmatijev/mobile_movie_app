import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { auth } from "@/services/firebase";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

    // Live email validation
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = validateEmail(email);

    // Button glow animation
  const loginGlow = useRef(new Animated.Value(0)).current;

  // Logo animation
  const logoTranslateY = useRef(new Animated.Value(-100)).current; // start above
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Welcome text animation
  const welcomeTranslateY = useRef(new Animated.Value(-30)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  // Sign in button
  const buttonTranslateX = useRef(new Animated.Value(-200)).current; // start off left
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Register text
  const registerTranslateY = useRef(new Animated.Value(20)).current; // start below
  const registerOpacity = useRef(new Animated.Value(0)).current;
  const registerGlow = useRef(new Animated.Value(0)).current;

    const handleLogin = () => {
    if (!isEmailValid || password.length === 0) return;

    setError("");

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(loginGlow, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(loginGlow, { toValue: 0, duration: 800, useNativeDriver: false }),
      ])
    ).start();

    // Firebase login
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace("/(tabs)"); // navigate to main app
      })
      .catch((err) => {
        console.log("Login error:", err.message);
        setError("Invalid email or password");
      });
  };


  useEffect(() => {
  Animated.sequence([
    // Logo starts immediately
    Animated.parallel([
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]),

    // Welcome overlaps but finishes together
    Animated.parallel([
      Animated.timing(welcomeTranslateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]),
  ]).start();

  // Button starts later but finishes at same time
  Animated.sequence([
    Animated.delay(800),
    Animated.parallel([
      Animated.timing(buttonTranslateX, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]),
  ]).start(() => {
    // Register comes AFTER everything finishes
    Animated.parallel([
      Animated.timing(registerTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(registerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(registerGlow, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(registerGlow, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();
  });
}, []);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Animated.Image
      source={icons.logo}
      className="w-12 h-10 mt-20 mb-5 mx-auto"
      style={{
          transform: [
            { translateY: logoTranslateY },
            { scale: logoScale },
          ],
          opacity: logoOpacity,
        }}
      />
      <View> 
        <Animated.Text
        className="text-white text-3xl font-bold mb-1 text-center" 
        style={{ opacity: welcomeOpacity, transform: [{ translateY: welcomeTranslateY }] }}>
          Welcome back!
        </Animated.Text>
      </View>
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mt-10">
        <TextInput 
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"       // <-- prevents automatic capitalization
        keyboardType="email-address" // <-- shows @ symbol on keyboard
        placeholderTextColor="#A8B5DB"
        className = "flex-1 ml-2 text-white"
        />
      </View>

      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4  mt-5">
        <TextInput 
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"      
        placeholderTextColor="#A8B5DB"
        className = "flex-1 ml-2 text-white"
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? icons.eyeOpen : icons.eyeClosed}
            className="w-6 h-6"
            tintColor="#A8B5DB"
          />
        </TouchableOpacity>
      </View>
      <Pressable onPress={() => router.push("/forgotpassword")}>
        <Text className="text-sm text-white text-right ml-5 mb-20 mt-3 mr-3">
          Forgot your <Text className="text-[#AB8BFF] font-semibold underline">password</Text>?</Text>
      </Pressable>
      
            {/* Firebase error */}
      {error.length > 0 && (
        <Text className="text-red-400 text-sm mb-2 ml-2">{error}</Text>
      )}

      <View className="pb-8 mt-10 flex-1 justify-end">  
        <Animated.View className="mb-10" style={{
            transform: [{ translateX: buttonTranslateX }],
            opacity: buttonOpacity,
      }}>
          <TouchableOpacity className="absolute bottom-3 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
          onPress={handleLogin}>
           <Image source={icons.arrow} className="size-5 mr-1 mt-0.5" tintColor="#FFFFFF"/>
           <Text className="text-white font-semibold text-base" >Sign in</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View   
          style={{
          transform: [{ translateY: registerTranslateY }],
          opacity: registerOpacity,
          }}>
          <Text 
          className="text-gray-400 text-sm mb-10 py-5 text-center"
          onPress={() => router.push("/register")}>
          Don’t have an account?  
            <Animated.Text className="text-[#AB8BFF] font-semibold" style={{
              color: registerGlow.interpolate({
              inputRange: [0, 1],
              outputRange: ['#AB8BFF', '#FFFFFF'], // pulsing glow
              }),
            }}>
               Register now!
            </Animated.Text>
          </Text>

        </Animated.View>
      </View>

    </View>
  );
}
