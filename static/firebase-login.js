'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
    // use your own config here but don't upload
};

window.addEventListener("load", function () {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    // updateUI(document.cookie);
    const signUp = document.getElementById("sign-up");
    !!signUp && signUp.addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if(!email.trim() || !password.trim()) {
            return window.alert("please enter email and password")
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.getIdToken().then((token) => {
                    window.alert("account ceate success!")
                    document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                    window.location = "/";
                });
            })
            .catch((error) => {
                console.log(error.code + error.message);
                window.alert("Error, please try later")
            });
    });

    const login = document.getElementById("login");
    !!login && login.addEventListener('click', function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if(!email.trim() || !password.trim()) {
            return window.alert("please enter email and password")
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("logged in");

                user.getIdToken().then((token) => {
                    document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                    console.log(window.location.pathname)
                    if(window.location.pathname == '/') {
                        window.location.reload();
                    } else {
                        window.location = "/";
                    }
                });
            })
            .catch((error) => {
                console.log(error.code + error.message);
                if(error.code == "auth/invalid-login-credentials") {
                    window.alert("Wrong email or password")
                } else {
                    window.alert("Error, please try later")
                }
            });
    });
});

function updateUI(cookie) {
    var token = parseCookieToken(cookie);
    const loginBox = document.getElementById("form-box");
    const logoutBox = document.getElementById("sign-out");
    if (token.length > 0) {
        !!loginBox && (loginBox.hidden = true);
        !!logoutBox && (logoutBox.hidden = false);
    } else {
        !!loginBox && (loginBox.hidden = false);
        !!logoutBox && (logoutBox.hidden = true);
    }
};

function parseCookieToken(cookie) {
    var strings = cookie.split(';');
    for (let i = 0; i < strings.length; i++) {
        var temp = strings[i].split('=');
        if (temp[0].trim() == "token") {
            return temp[1];
        }

    }
    return "";
};