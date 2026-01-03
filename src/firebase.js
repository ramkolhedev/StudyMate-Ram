// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-IHnCXnj24aZcguqjO4YaxqLM8a3vdHM",
  authDomain: "study-mate-b31fc.firebaseapp.com",
  projectId: "study-mate-b31fc",
  storageBucket: "study-mate-b31fc.appspot.com",
  messagingSenderId: "748006021053",
  appId: "1:748006021053:web:43c5337f1c9f4703a424d4",
  measurementId: "G-4C2RW2H7VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Authentication and export it
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
