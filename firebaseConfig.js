// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFKAiz7_1Ht4_fe4_px8tovUOMSsbCEEs",
  authDomain: "gocart-9ae17.firebaseapp.com",
  projectId: "gocart-9ae17",
  storageBucket: "gocart-9ae17.firebasestorage.app",
  messagingSenderId: "229212762055",
  appId: "1:229212762055:web:48f7ec023ea9cb9a3e33e2",
  measurementId: "G-6VWXFEHZ2L"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);