import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyBsACvtC7TvpQVLXx9BD9leDHOHYnRrCjk",
  authDomain: "book-santa-app-whj.firebaseapp.com",
  databaseURL: "https://book-santa-app-whj.firebaseio.com",
  projectId: "book-santa-app-whj",
  storageBucket: "book-santa-app-whj.appspot.com",
  messagingSenderId: "888867110780",
  appId: "1:888867110780:web:802a7ca6fdabb2b80a6ef9"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
