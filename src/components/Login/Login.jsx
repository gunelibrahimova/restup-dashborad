import React, { useEffect, useRef, useState } from 'react'
import { auth } from '../../config/firebase'
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import './_login.scss'

const Login = () => {
    
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth,
            emailRef.current.value, passwordRef.current.value
        ).then(user => {
            console.log('user', user)
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div id="login">
            <form action="">
                <div className="well">
                    <div className="icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <h2>Login</h2>
                    <p><strong>Email</strong></p>
                    <input ref={emailRef} type="email" />
                    <p style={{ marginTop: "10px" }}><strong>Password</strong></p>
                    <input ref={passwordRef} type="password" />
                    <div className="button">
                        <button type="submit" class="cart-btn" onClick={signIn}> Sign in</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login



