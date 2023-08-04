// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBMxDj-mXBHQm0WBXEjosTtf_J7HR2TYQ",
  authDomain: "technicaltest-514ab.firebaseapp.com",
  projectId: "technicaltest-514ab",
  storageBucket: "technicaltest-514ab.appspot.com",
  messagingSenderId: "170811553279",
  appId: "1:170811553279:web:ce9c191c8e925e8ca023ca",
  measurementId: "G-8CHW9W4GP2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const setUserData = async (userId, userData) => {
  await setDoc(doc(db, "users", userId), userData);
};

export default app;
