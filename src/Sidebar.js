import React from 'react';
import './Sidebar.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';


function Sidebar({ open, setIsAuth }) {

    const loginInWithGoogle = () => {
      //googleログイン処理
      signInWithPopup(auth, provider).then((result) => {
        localStorage.setItem("isAuth", true)
        setIsAuth(true);
      });
    };
  

  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
        <button className='login-list' onClick={loginInWithGoogle}>Googleでログイン</button>
        <button className='fav-list'>お気に入りリスト</button>  
    </div>
  );
}

export default Sidebar;