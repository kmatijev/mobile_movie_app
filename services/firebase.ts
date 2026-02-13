// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyAV2oDZ7wmSqx6Rp9L6dDO1NBVrKmeZRtM",

  authDomain: "movie-app-14d72.firebaseapp.com",

  projectId: "movie-app-14d72",

  storageBucket: "movie-app-14d72.firebasestorage.app",

  messagingSenderId: "159735272177",

  appId: "1:159735272177:web:5fd70185bfeec45562cf50"

};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Disable persistence so user is logged out when app closes
setPersistence(auth, inMemoryPersistence).catch((err) => {
  console.log("Failed to set persistence:", err);
});
