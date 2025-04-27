import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDPeEraTaOCZ5jRifjqWhqvorB-g2gRxQs",
  authDomain: "currency-converter-330c1.firebaseapp.com",
  databaseURL: "https://currency-converter-330c1-default-rtdb.firebaseio.com",
  projectId: "currency-converter-330c1",
  storageBucket: "currency-converter-330c1.firebasestorage.app",
  messagingSenderId: "977343331482",
  appId: "1:977343331482:web:d0e78b90b656896178b323",
  measurementId: "G-WHQ80EKH1Z"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, off };