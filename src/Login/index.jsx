import React, { useState } from 'react';
import { NavLink, Redirect } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/database";

const LogIn = () => {
   const [logged, setLogin] = useState(false);
   const [inputValues, setInputValues] = useState({
      email: '', password: ''
   });

   const changeState = event => {
      const { name, value } = event.target;
      setInputValues({ ...inputValues, [name]: value });
   };
   const LogInUser = async () => {
      await firebase.auth().signInWithEmailAndPassword(inputValues.email, inputValues.password)
         .then((user) => {
            setLogin(true);
         }
         )
         .catch((error) => {
            setLogin(false);
            alert(" User is missing or incorrectly entered password and email");
         });
   }


   return (<>
      {logged
         ? <Redirect to="/timer"></Redirect>
         : <section className="logIn">
            <h1 className="logIn__">Login</h1>
            <form action="" className="logIn__form">
               <input type="text" name="email" className="logIn__mail" placeholder="login" onChange={changeState} value={inputValues.email} />
               <input type="password" name="password" autoComplete="on" className="logIn__password" placeholder="password" onChange={changeState} value={inputValues.password} />
               <NavLink to="/" className="logIn__login" onClick={LogInUser}>Login</NavLink>
               <div className="logIn__reg">
                  <span className="logIn__text">Don't have accoount yet</span>
                  <NavLink className="logIn__btn" exact to="/register">Register</NavLink>
               </div>
            </form>
         </section>
      }</>
   );
}

export default LogIn;


