import React from 'react';
import './Sidebar.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';


function Sidebar({ setIsAuth, open }) {

  const isAuth = localStorage.getItem("isAuth") === "true";

    const loginInWithGoogle = () => {
      //googleログイン処理
      signInWithPopup(auth, provider).then((result) => {
      }).catch((error) => {
        if(error.code === 'auth/popup-closed-by-user') {
          alert('ログイン時に予期せぬエラーが発生しました。再度ログインをお試しください。');
        };
      });
    };
  
    const logoutInWithGoogle = () => {
      auth.signOut().then(() => {
        localStorage.removeItem("isAuth");
        setIsAuth(false);
      });
    };

  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      {isAuth ? (
        <>
        <button className='login-list' onClick={logoutInWithGoogle}>ログアウト</button>
        <button className='fav-list'>お気に入りリスト</button>  
        </>
      ) : (
        <button className='login-list' onClick={loginInWithGoogle}>Googleでログイン</button>
      )}
    </div>
  );
}

export default Sidebar;