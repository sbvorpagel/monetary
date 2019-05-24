import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAAEydqTs7fZg30Q4JRcqYG99ttG4QwiwE",
  authDomain: "monetary-47f4a.firebaseapp.com",
  databaseURL: "https://monetary-47f4a.firebaseio.com",
  projectId: "monetary-47f4a",
  storageBucket: "monetary-47f4a.appspot.com",
  messagingSenderId: "324201016162",
  appId: "1:324201016162:web:3eb5ffcbf1fdad7f"
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();