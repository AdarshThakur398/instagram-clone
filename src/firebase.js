import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyC9lExPno5iuEi4_sQIrslXMWR24jGCDag",
  authDomain: "instagram-clone-react-c79f1.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-c79f1-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-c79f1",
  storageBucket: "instagram-clone-react-c79f1.appspot.com",
  messagingSenderId: "324287734124",
  appId: "1:324287734124:web:f05401458c9426f0be5349",
  measurementId: "G-7FLR85SPVT"
};
// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db ,storage};