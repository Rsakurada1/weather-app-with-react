import React, { useEffect, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import "./StarIcon.css"
import {  getFirestore, addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';



const StarIcon = ( {isAuth, location, hasError, data} ) => {
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
      if(hasError){
        console.log("haserrorチェック", hasError)
        alert("有効な地域名を入力してください")
        return false;
      }
      try {
        // APIリクエストで取得した正確な地名を使用してドキュメントを追加
        const accurateLocationName = data.name;
        
        await addDoc(collection(db, "weather"), {
          Location: accurateLocationName,
          auther: {
            username: auth.currentUser.displayName,
            id: auth.currentUser.uid
          }
        });
        console.log('Document added');
        return true;
      } catch (e) {
        console.error('Error adding document: ', e);
        return false;
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

    const clickStar = async() => {
      if (!isAuth) {
        alert("お気に入りリストに追加/削除するにはログインをしてください");
        return false;
      }

    if (isFavorite) {
        await removeFavLocation();
        alert("お気に入りリストから削除しました。"); 
        setIsFavorite(false);
      } else {
       const isSuccess = await addFavLocation();
    if (isSuccess) {
      const shouldShowMessage = localStorage.getItem('doNotShowMessage') !== 'true';
      if (shouldShowMessage) {
        const userChoice = window.confirm('お気に入りリストに追加しました。今後このメッセージを表示しない場合は、OKをクリックしてください。');
        if (userChoice) {
          localStorage.setItem('doNotShowMessage', 'true');
            }
        }
        setIsFavorite(true);
    }
  }
}

  return (
    <div className='star'>
        <button className={`fa ${isFavorite ? 'fa-star' : 'fa-star-o'} star-button `} onClick={clickStar} location={location}></button>
    </div>
  )
}

export default StarIcon