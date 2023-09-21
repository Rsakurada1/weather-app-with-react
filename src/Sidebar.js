import React from 'react';
import './Sidebar.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function Sidebar({ open }) {
  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
        <button className='login-list'>Googleでログイン</button>
        <button className='fav-list'>お気に入りリスト</button>  
    </div>
  );
}

export default Sidebar;