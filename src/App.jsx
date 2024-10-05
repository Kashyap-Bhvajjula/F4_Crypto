import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    return cryptoData.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortByMarketCap = () => {
    const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
    setCryptoData(sortedData);
  };

  const sortByPercentageChange = () => {
    const sortedData = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    setCryptoData(sortedData);
  };

  const filteredData = handleSearch();

  return (
    <div className="App">
      <div className='navBar'>
        <input 
          className='input'
          type="text"
          placeholder="Search by Name or Symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='mCap' onClick={sortByMarketCap}>Sort by Mkt Cap</button>
        <button className='pChange' onClick={sortByPercentageChange}>Sort by Percentage</button>
      </div>
      <table>
        <tbody>
          {filteredData.map(coin => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} width="30" style={{ marginRight: '10px' }} />
                {coin.name}
              </td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td >
                ${coin.current_price.toLocaleString()}
              </td>
              <td >
                ${coin.total_volume.toLocaleString()}
              </td>
              <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td >
                Mkt Cap: ${coin.market_cap.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
