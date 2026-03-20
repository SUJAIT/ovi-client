// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB88WXX_Qq88tHK72HIRWBgXyaUrClqkx4",
    authDomain: "ovi-workstation.firebaseapp.com",
    projectId: "ovi-workstation",
    storageBucket: "ovi-workstation.firebasestorage.app",
    messagingSenderId: "283568899317",
    appId: "1:283568899317:web:3b97acd09b24b4c18db1bc",
    measurementId: "G-5FKYWVV696"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);