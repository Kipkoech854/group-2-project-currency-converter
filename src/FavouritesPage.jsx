import React, { useEffect, useState } from 'react';
import './App.css';
import { db, ref, onValue, set, off } from './firebase';

const FavoritesPage = ({ setFromCurrency, setToCurrency }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Set up Firebase listener for favorites
        const favRef = ref(db, 'favorites');
        
        const unsubscribe = onValue(favRef, (snapshot) => {
            const data = snapshot.val() || [];
            setFavorites(data);
        });

        // Clean up listener on unmount
        return () => off(favRef);
    }, []);

    const removeFavorite = (pairToRemove) => {
        const updatedFavorites = favorites.filter(pair => pair !== pairToRemove);
        // Update Firebase instead of localStorage
        set(ref(db, 'favorites'), updatedFavorites);
    };

    const handlePairClick = (pair) => {
        const [from, to] = pair.split('-');
        setFromCurrency(from);
        setToCurrency(to);
    };

    return (
        <div className="favorites-page">
            <h3 className="page-title" style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
                Your Favorite Pairs
            </h3>

            {favorites.length === 0 ? (
                <p style={{ color: "white", textAlign: "center" }}>No favorite pairs saved yet.</p>
            ) : (
                <ul className='favorites-list'>
                    {favorites.map((pair, index) => (
                        <li key={index} className='favorite-item'>
                            <span 
                                onClick={() => handlePairClick(pair)}
                                style={{ cursor: 'pointer' }}
                            >
                                {pair}
                            </span>
                            <button 
                                onClick={() => removeFavorite(pair)} 
                                className='delete-button'
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesPage;