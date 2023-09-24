import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Firestoreのインスタンスをインポート
import "./FavoriteList.css"

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // onSnapshotリスナーをセットアップ
    const unsubscribe = onSnapshot(collection(db, "weather"), (snapshot) => {
      const newFavorites = snapshot.docs.map(doc => doc.data().Location);
      setFavorites(newFavorites);
    });

    // コンポーネントのクリーンアップ時にリスナーを解除
    return () => unsubscribe();
  }, []);

  return (
    <div className='favorite-container'>
        <h5>お気に入りリスト</h5>
      <ul className='favorite-list'>
        {favorites.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;
