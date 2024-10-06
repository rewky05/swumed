import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC6KX9mmQsXEcwGscn9UC8mwJajeCDONho",
  authDomain: "swumed-afb7e.firebaseapp.com",
  projectId: "swumed-afb7e",
  storageBucket: "swumed-afb7e.appspot.com",
  messagingSenderId: "900266635464",
  appId: "1:900266635464:web:e3dea746bafd4219ce75fd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };