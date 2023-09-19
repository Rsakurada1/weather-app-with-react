import React from 'react';
import './Sidebar.css';

function Sidebar({ open }) {
  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <ul>
        <li className='list'>ログイン</li>
        <li className='list'>天気ニュース</li>
        <li className='list'>お気に入りリスト</li>
      </ul>
    </div>
  );
}

export default Sidebar;