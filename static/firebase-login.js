'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
    // use your own config here but don't upload
};

window.addEventListener("load", function () {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const signUp = document.getElementById("sign-up");
    !!signUp && signUp.addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const password = document.getElementById("password").value;
        if (!name.trim() || !email.trim() || !password.trim()) {
            return window.alert("Please enter name, email and password")
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.getIdToken().then((token) => {
                    fetch("/signUp", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            uid: user.uid,
                            'name': email,
                            'profile_name': name || '/'
                        })
                    }).then((res) => {
                        window.alert("account ceate success!")
                        document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                        window.location = "/";
                    })
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
        if (!email.trim() || !password.trim()) {
            return window.alert("please enter email and password")
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("logged in");

                user.getIdToken().then((token) => {
                    document.cookie = "token=" + token + ";path=/;SameSite=Strict";
                    console.log(window.location.pathname)
                    if (window.location.pathname == '/') {
                        window.location.reload();
                    } else {
                        window.location = "/";
                    }
                });
            })
            .catch((error) => {
                console.log(error.code + error.message);
                if (error.code == "auth/invalid-login-credentials") {
                    window.alert("Wrong email or password")
                } else {
                    window.alert("Error, please try later")
                }
            });
    });
});

window.handleLogout = function () {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signOut(auth)
        .then((output) => {
            // remove the ID token for the user and force a redirect to /
            alert("You have signed out")
            document.cookie = "token=;path=/;SameSite=Strict";
            window.location = "/";
        });
}