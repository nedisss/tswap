import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD82vrw-sIveMegD7TC19ZyVSWzbb2gg68",
  authDomain: "tswap-c0f2c.firebaseapp.com",
  projectId: "tswap-c0f2c",
  storageBucket: "tswap-c0f2c.firebasestorage.app",
  messagingSenderId: "322289583706",
  appId: "1:322289583706:web:87ef86a9d62eb32db0fa63",
  measurementId: "G-GBG83WJKES"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
