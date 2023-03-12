import * as firebase from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkpCdayFL9fFwjqEG2DaSGYA0Vz73EVog",
  authDomain: "restup-94cc2.firebaseapp.com",
  projectId: "restup-94cc2",
  storageBucket: "restup-94cc2.appspot.com",
  messagingSenderId: "663898947270",
  appId: "1:663898947270:web:0191c5fb9844b7417061c7",
  measurementId: "G-4ZSLGGM3PY"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth()
export { auth };
// export const authh = getAuth(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);




