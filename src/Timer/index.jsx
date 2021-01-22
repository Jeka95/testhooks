import React, { useEffect, useState } from 'react';
import { NavLink, Redirect } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/database";

import timer from "../asset/timer.png";

var user;
var data;
var interval;
const Timer = () => {

   const [logged, setLogin] = useState(true);
   const [curuser, setUser] = useState({
      username: "",
      email: "",
      timedeskop: 0,
      timemobile: 0
   });


   const getUser = async () => {
      user = await firebase.auth().currentUser;
      if (user) {
         setLogin(true)
         var readtime = await firebase.database().ref('users/' + user.uid);
         readtime.on('value', (snapshot) => {
            data = snapshot.val();
            setUser({
               username: data.username,
               email: data.email,
               timedeskop: data.timedeskop,
               timemobile: data.timemobile
            })
         });
      } else {
         setLogin(false);
      }

   }
   useEffect(() => {
      getUser();
      user = firebase.auth().currentUser;
      if (user) {
         var userId = user.uid;
         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            console.log("Вы используете мобильное устройство (телефон или планшет).");
            interval = setInterval(() => {
               firebase.database().ref('users/' + userId).set({
                  email: data.username,
                  username: data.email,
                  timedeskop: data.timedeskop + 1000,
                  timemobile: data.timemobile
               })
            }, 1000)
         } else {
            console.log("Вы используете ПК.");
            interval = setInterval(() => {
               firebase.database().ref('users/' + userId).set({
                  email: data.email,
                  username: data.username,
                  timedeskop: data.timedeskop + 1000,
                  timemobile: data.timemobile
               })
            }, 1000);
         }
         return () => function cleanup() {
            clearInterval(interval);
            clearTimeout(interval);
         }
      }
   }, [])

   function timeFormatter(time) {
      time = new Date(time);
      let hours = time.getUTCHours().toString();
      let minutes = time.getMinutes().toString();
      let seconds = time.getSeconds().toString();
      if (hours.length < 2) {
         hours = '0' + hours;
      }
      if (minutes.length < 2) {
         minutes = '0' + minutes;
      }
      if (seconds.length < 2) {
         seconds = '0' + seconds;
      }
      return hours + ' : ' + minutes + ' : ' + seconds;
   }

   const singout = () => {
      firebase.auth().signOut().then(() => {
         clearInterval(interval);
         clearTimeout(interval);

      }).catch((error) => {
         // An error happened.
      });
   }

   return (<>
      {
         logged
            ?
            <section className="logged">
               <div>Hello {curuser.username}</div>
               <NavLink to="/" className="logged__out" onClick={singout} >Log out</NavLink>
               <div className="logged__deskop">
                  <div className="logged__deskoptext">Deskop</div>
                  <img src={timer} alt="" />
                  <div className="logged__timedeskop"> {timeFormatter(curuser.timedeskop)}  </div>
               </div>
               <div className="logged__mobile">
                  <div className="logged__mobiletext">Mobile</div>
                  <img src={timer} alt="" />
                  <div className="logged__timemobile"> {timeFormatter(curuser.timemobile)}  </div>
               </div>
            </section>
            : <Redirect to="/"></Redirect>

      }</>)
}


export default Timer;
