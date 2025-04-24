import React from 'react';

const SwapButton = ({ onSwap }) => {
  return (
    <button className='swap-button' onClick={onSwap}>
      Swap
    </button>
  );
};

export default SwapButton;