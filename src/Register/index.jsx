import React, { useState } from 'react';
import { Redirect, NavLink } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/database";

import FirebaseConfig from '../FirebaseConfig';

firebase.initializeApp(FirebaseConfig);
const database = firebase.database();

const Register = () => {


   const [inputValues, setInputValues] = useState({
      firstname: "", lastname: "", email: '', password: '',
   });
   const [logged, setLogin] = useState(false);

   const changeState = event => {
      const { name, value } = event.target;
      setInputValues({ ...inputValues, [name]: value });
   }

   const handleRegistration = async (e) => {
      e.preventDefault();

      let nameProfile = inputValues.firstname + " " + inputValues.lastname;
      await firebase.auth().createUserWithEmailAndPassword(inputValues.email, inputValues.password).then(function (data) {
         data.user.updateProfile({ displayName: nameProfile })
      }).catch(function (error) {
      });
      var userId = firebase.auth().currentUser.uid;
      database.ref('users/' + userId).set({
         username: nameProfile,
         email: inputValues.email,
         timemobile: 0,
         timedeskop: 0,
      })
      setLogin(true);
   }

   return (
      <>
         {logged
            ? <Redirect to="/timer"></Redirect>
            :
            <section className="register">
               <h2 className="register">Register</h2>
               <form action="" className="register__form">
                  <input type="text" name="firstname" className="register__firstname" placeholder="First Name" onChange={changeState} value={inputValues.firstname} />
                  <input type="text" name="lastname" className="register__lastname" placeholder="Last Name" onChange={changeState} value={inputValues.lastname} />
                  <input type="text" name="email" className="register__email" placeholder="Email" onChange={changeState} value={inputValues.email} />
                  <input type="password" name="password" className="register__password" autoComplete="on" placeholder="password" onChange={changeState} value={inputValues.password} />
                  <button type="submit" onClick={handleRegistration} className="register__singup">Sing up</button>
                  <div className="register__login">
                     <span className="register__text">Alredy registered?</span>
                     <NavLink className="register__singin" to="/" >Log in</NavLink>
                  </div>
               </form>
            </section>}</>
   );
}


export default Register;

// class Register extends React.Component {
//    constructor(props) {
//       super(props);
//       this.state = {
//          firstname: "",
//          lastname: "",
//          email: "",
//          password: "",
//          logIn: false,
//       }
//    }


//    render() {
//       if (this.state.logIn) {
//          return <Redirect to="/timer" />
//       }
//       return (
//          <section className="register">
//             <h2 className="register">Register</h2>
//             <form action="" className="register__form">
//                <input type="text" name="firstname" className="register__firstname" placeholder="First Name" onChange={this.changeState} value={this.state.firstname} />
//                <input type="text" name="lastname" className="register__lastname" placeholder="Last Name" onChange={this.changeState} value={this.state.lastname} />
//                <input type="text" name="email" className="register__email" placeholder="Email" onChange={this.changeState} value={this.state.email} />
//                <input type="password" name="password" className="register__password" autoComplete="on" placeholder="password" onChange={this.changeState} value={this.state.password} />
//                <button type="submit" to="/timer" onClick={this.handleRegistration} className="register__singup">Sing up</button>
//                <div className="register__login">
//                   <span className="register__text">Alredy registered?</span>
//                   <NavLink className="register__singin" to="/" >Log in</NavLink>
//                </div>
//             </form>
//          </section>
//       );
//    }
// }

// export default Register;
