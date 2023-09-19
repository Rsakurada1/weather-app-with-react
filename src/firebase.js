import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAHELeEF7H2sJDPusgpi9W6POxk0Cm3DQ0",
  authDomain: "weather-b71d6.firebaseapp.com",
  projectId: "weather-b71d6",
  storageBucket: "weather-b71d6.appspot.com",
  messagingSenderId: "1050094844767",
  appId: "1:1050094844767:web:729867f247512e38d314ea"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { atuh, provider, db };