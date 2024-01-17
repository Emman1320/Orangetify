// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl8fh6JL7bmn-pO_5Ar5FFKson0IVcuXs",
  authDomain: "orangetify.firebaseapp.com",
  projectId: "orangetify",
  storageBucket: "orangetify.appspot.com",
  messagingSenderId: "988232165953",
  appId: "1:988232165953:web:39e48dd11fb3d402b234c0",
  measurementId: "G-E08Y48L23B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
