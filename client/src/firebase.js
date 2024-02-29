// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tushid-blog.firebaseapp.com",
  projectId: "tushid-blog",
  storageBucket: "tushid-blog.appspot.com",
  messagingSenderId: "731905307410",
  appId: "1:731905307410:web:f49b87892022a3bb3af9cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);