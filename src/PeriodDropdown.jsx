import React, { useState } from 'react';

const periods = [
  { label: '2 Weeks', value: 14, color: '#2196F3' },  
  { label: '1 Month', value: 30, color: '#4CAF50' },   
  { label: '2 Months', value: 60, color: '#FF9800' },  
  { label: '3 Months', value: 90, color: '#9C27B0' },   
  { label: '6 Months', value: 180, color: '#F44336' }, 
  { label: '1 Year', value: 365, color: '#607D8B' }     
];

const PeriodDropdown = ({ onSelectPeriod }) => {
  const [selectedValue, setSelectedValue] = useState(periods[0].value);

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedValue(value);
    onSelectPeriod(value);
  };

  
  const getOptionStyle = (period) => {
    return {
      backgroundColor: selectedValue === period.value ? period.color : 'white',
      color: selectedValue === period.value ? 'white' : 'black',
      padding: '8px'
    };
  };

  return (
    <div className="period-dropdown">
      <label htmlFor="period-select">Select Period: </label>
      <select 
        id="period-select" 
        onChange={handleChange}
        value={selectedValue}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        {periods.map((period) => (
          <option 
            key={period.value} 
            value={period.value}
            style={getOptionStyle(period)}
          >
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodDropdown;