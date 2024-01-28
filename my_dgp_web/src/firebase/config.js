import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBguyAOFAtrvxR3i-0ITDyd0iDax1ld9eI",
  authDomain: "my-dgp.firebaseapp.com",
  projectId: "my-dgp",
  storageBucket: "my-dgp.appspot.com",
  messagingSenderId: "838612429733",
  appId: "1:838612429733:web:6a7c15690e45e262b2964c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
