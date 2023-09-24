import React, { useEffect, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import "./StarIcon.css"
import {  getFirestore, addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';



const StarIcon = ( {isAuth, location} ) => {
    console.log("isAuth:", isAuth);
    console.log("location初期値", location);
    const [ isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      if (isAuth) {
          const checkFavorite = async () => {
              const q = query(collection(db, "weather"), where("Location", "==", location));
              const querySnapshot = await getDocs(q);
              setIsFavorite(!querySnapshot.empty); 
          };
          checkFavorite();
      } else {
          setIsFavorite(false);
      }
  }, [location, isAuth]);

    //お気に入りリストへの追加処理
    const addFavLocation = async () => {
        try {
            await addDoc(collection(db, "weather"), {
              Location: location,
              auther: {
                username: auth.currentUser.displayName,
                id: auth.currentUser.uid
              }
            });
            console.log('Document added');
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        };
        
        //お気に入りリストから該当する地域の削除
        const removeFavLocation = async () => {
          try {
            const q = query(collection(db, "weather"), where("Location", "==", location));
            const querySnapshot = await getDocs(q);
        
            querySnapshot.forEach((docSnapshot) => {
              deleteDoc(doc(db, "weather", docSnapshot.id));
            });
        
            console.log('Document removed');
          } catch (e) {
            console.error('Error removing document: ', e);
          }
        };   

    const clickStar = () => {
      if (!isAuth) {
        alert("お気に入りリストに追加/削除するにはログインをしてください");
        return;
      }

    if (isFavorite) {
        removeFavLocation();
        alert("お気に入りリストから削除しました。"); 
      } else {
        addFavLocation();

        const shouldShowMessage = localStorage.getItem('doNotShowMessage') !== 'true';

        if (shouldShowMessage) {
            const userChoice = window.confirm('お気に入りリストに追加しました。今後このメッセージを表示しない場合は、OKをクリックしてください。');

            if (userChoice) {
                localStorage.setItem('doNotShowMessage', 'true');
            }
        }
    }

    setIsFavorite(prevState => !prevState);
}

  return (
    <div className='star'>
        <button className={`fa ${isFavorite ? 'fa-star' : 'fa-star-o'} star-button `} onClick={clickStar} location={location}></button>
    </div>
  )
}

export default StarIcon