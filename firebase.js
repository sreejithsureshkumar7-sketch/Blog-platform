// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZbrnl4mzA3H5HKH_YQoHM7apF1wok5lo",
  authDomain: "blog-platform-9f113.firebaseapp.com",
  projectId: "blog-platform-9f113",
  storageBucket: "blog-platform-9f113.firebasestorage.app",
  messagingSenderId: "73518344019",
  appId: "1:73518344019:web:350149660d8a942c4ee3a6",
  measurementId: "G-8BJWEVJVTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
