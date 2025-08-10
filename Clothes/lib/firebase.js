import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_sKUmRoJVLAPFnMy6YH7zdaIR1K0QKsE",
  authDomain: "clothes-b15d9.firebaseapp.com",
  projectId: "clothes-b15d9",
  storageBucket: "clothes-b15d9.firebasestorage.app",
  messagingSenderId: "251884923143",
  appId: "1:251884923143:web:c6d4dd4b4fa1a45f797da2"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Initialize Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // Ensure account selection

export { auth, db, storage, provider, app }; // Export the provider as well
 // Export the provider as well
