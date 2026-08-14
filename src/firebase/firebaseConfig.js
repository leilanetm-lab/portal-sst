import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNBx-IMzYoYLExmzd5ENd0UU7ApRApzPw",
  authDomain: "portal-sst-manserv.firebaseapp.com",
  projectId: "portal-sst-manserv",
  storageBucket: "portal-sst-manserv.firebasestorage.app",
  messagingSenderId: "737455467678",
  appId: "1:737455467678:web:3efa0d9a2cbb0dec98df8f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;