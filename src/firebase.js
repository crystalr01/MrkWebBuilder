// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD7EqMUFLJXvUVGUr-MlEJMrjSqxdDUnOU",
  authDomain: "scroller-4d10f.firebaseapp.com",
  databaseURL: "https://scroller-4d10f-default-rtdb.firebaseio.com",
  projectId: "scroller-4d10f",
  storageBucket: "scroller-4d10f.appspot.com",
  messagingSenderId: "1053362115345",
  appId: "1:1053362115345:web:1e42a1c584dae0765a32b0",
  measurementId: "G-7Y65NLWMKL"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Realtime Database
const database = getDatabase(app);
export default database;
