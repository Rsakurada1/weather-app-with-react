import React, { useEffect, useState } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import "./StarIcon.css"
import {  getFirestore, addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';



const StarIcon = ( {isAuth, location, hasError, searchCounter} ) => {
    const [ isFavorite, setIsFavorite] = useState(false);

    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
      console.log("★StarIcon:検索カウンター情報", searchCounter);
    }, [searchCounter]);

    useEffect(() => {
      console.log("★StarIcon:お気に入りリスト情報", isFavorite);
    }, [searchCounter]);

    useEffect(() => {
      console.log("★StarIcon:エラー情報", hasError);
    }, [hasError]);

    useEffect(() => {
      const checkFavorite = async () => {
          if (hasError) return;
          
          const q = query(collection(db, "users", userId, "favorites"), where("Location", "==", location));
          const querySnapshot = await getDocs(q);
          setIsFavorite(!querySnapshot.empty);
      };
      
      if (isAuth && location && !hasError) {
          checkFavorite();
      } else if (hasError) {
          // 検索エラーが発生しても、isFavoriteの状態は変更しない
          return;
      } else {
          setIsFavorite(false);
      }
  }, [location, isAuth, hasError, searchCounter]);

    //お気に入りリストへの追加処理
    
    const addFavLocation = async () => {
      if(hasError){
        console.log("haserrorチェック", hasError)
        alert("正しく地域名を入力してください")
        return false;
      }
      try {
        await addDoc(collection(db, "users", userId, "favorites"), {
          Location: location,
        });
        console.log('Document added');
        setIsFavorite(true);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };
        
        //お気に入りリストから該当する地域の削除
        const removeFavLocation = async () => {
          try {
            const q = query(collection(db, "users", userId, "favorites"), where("Location", "==", location));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docSnapshot) => {
                console.log('Removing document with ID:', docSnapshot.id);
                await deleteDoc(doc(db, "users", userId, "favorites", docSnapshot.id));
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