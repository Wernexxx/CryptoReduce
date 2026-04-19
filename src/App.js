import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const tg = window.Telegram.WebApp;

// Получи этот ключ у @toncenter_bot в Telegram
const TON_API_KEY = '4bd5db0c93a106cdd3f37ad8cf20b07ace1ad4c0845da417af3e9c3f5333be5e'; 

function App() {
  const [balance, setBalance] = useState('0.00');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000');

    // Извлекаем адрес кошелька из URL параметров
    const params = new URLSearchParams(window.location.search);
    const userAddr = params.get('addr');
    
    if (userAddr) {
      setAddress(userAddr);
      fetchBalance(userAddr);
    }
  }, []);

  const fetchBalance = async (walletAddr) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://toncenter.com/api/v2/getAddressBalance`, {
        params: { address: walletAddr, api_key: TON_API_KEY }
      });
      // Конвертируем нанотоны в TON
      const realBalance = (response.data.result / 1000000000).toFixed(2);
      setBalance(realBalance);
    } catch (error) {
      console.error("Ошибка сети:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="animated-bg"></div>
      
      <div className="header">
        <span className="user-badge">@{tg.initDataUnsafe?.user?.username || 'User'}</span>
      </div>

      <div className="balance-card">
        <h1 className="main-amount">
          $ {(balance * 7.5).toFixed(2)} <span className="eye-icon">👁️</span>
        </h1>
        <p className="currency-label">{balance} TON</p>
      </div>

      <div className="actions-grid">
        <div className="action-item">
          <div className="icon-box">↗</div>
          <span>Вывести</span>
        </div>
        <div className="action-item">
          <div className="icon-box">⇄</div>
          <span>Обмен</span>
        </div>
        <div className="action-item">
          <div className="icon-box">👤</div>
          <span>P2P</span>
        </div>
      </div>

      <div className="assets-section">
        <div className="section-header">
          <span>Мои активы</span>
          <span className="blue-link">Все транзакции</span>
        </div>
        
        <div className="asset-row">
          <div className="asset-info">
            <div className="asset-logo">💎</div>
            <div>
              <div className="asset-name">Toncoin</div>
              <div className="asset-price">$7.50 <span className="up">+2.4%</span></div>
            </div>
          </div>
          <div className="asset-balance">
            <div>{balance} TON</div>
            <div className="sub-val">${(balance * 7.5).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;