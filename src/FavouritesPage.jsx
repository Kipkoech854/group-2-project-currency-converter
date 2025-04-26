import React, { useEffect, useState } from 'react';
import './App.css'

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() =>{
        const storedFavorites = JSON.parse(localStorage.getItem('favorites'))
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (pairToRemove) => {
        const updatedFavorites = favorites.filter(pair => pair !==pairToRemove);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

  return (
    <div className="favorites-page">
      <h3 className="page-title" style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>Your Favorite Pairs</h3>

        {favorites.length === 0 ? (
            <p>No favorite pairs saved yet.</p>
        ) : (
            <ul className='favorites-list'>
                {favorites.map((pair, index) => (
                    <li key={index} className='favorite-item'>{pair}
                        <button onClick={() => removeFavorite(pair)} className='delete-button'>❌</button>
                    </li>
                ))}
            </ul>
        )
    }

    </div>
  )
}

export default FavoritesPage