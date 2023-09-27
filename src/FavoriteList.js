import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Firestoreのインスタンスをインポート
import "./FavoriteList.css"

const FavoriteList = ({ onFavoriteClick, auth }) => {
  const [favorites, setFavorites] = useState([]);
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (userId) {
      // ユーザーごとのfavoritesサブコレクションに対してonSnapshotリスナーをセットアップ
      const unsubscribe = onSnapshot(collection(db, "users", userId, "favorites"), (snapshot) => {
        const newFavorites = snapshot.docs.map(doc => doc.data().Location);
        setFavorites(newFavorites);
      });

      // コンポーネントのクリーンアップ時にリスナーを解除
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <div className='favorite-container'>
      <h5>お気に入りリスト</h5>
      <ul className='favorite-list'>
        {favorites.map((location, index) => (
          <li key={index} onClick={() => onFavoriteClick(location)}>{location}</li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;
