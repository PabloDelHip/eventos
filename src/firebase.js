import firebase from 'firebase/app';

require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/functions");

var firebaseConfig = {
    apiKey: "AIzaSyDjes9AckjhZh-QwzWvi0KnkOkkSSihfYg",
    authDomain: "teatro-vue.firebaseapp.com",
    databaseURL: "https://teatro-vue.firebaseio.com",
    projectId: "teatro-vue",
    storageBucket: "teatro-vue.appspot.com",
    messagingSenderId: "100326105703",
    appId: "1:100326105703:web:052b705c5e716847326ac2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();

export {
    firebase,
    auth,
    db,
    storage,
    functions
}