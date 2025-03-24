import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import "./styles/modern.css"
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext';

function Login() {
  // Dùng để điều hướng trang
  const navigate = useNavigate();

  const [ganacheAccounts, setGanacheAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [error, setError] = useState('');
  const { setAccountList, setCurrentAccount, setBatchStatus, setMilkBoxStatus } = useContext(AccountContext);

  // Danh sách tài khoản hardcode hiển thị trong dropdown
  const accountList = [
    { role: 'ADMIN', name: 'Quản trị', address: '0x8B5608591A2360d53b20e26460C59BC8c9f5c974' },
    { role: 'FARM', name: 'Trang trại', address: '0x53fD2C237a18d3A731137E3a90bd41E12B90B173' },
    { role: 'MANUFACTURER', name: 'Nhà sản xuất', address: '0xb80e8874565f88870Ad19EFB5Afa6f2BFe20409c' },
    { role: 'DISTRIBUTOR', name: 'Nhà phân phối', address: '0xe03c2402330fE27f3DFd803B40aD1eA18D313019' },
    { role: 'RETAILER', name: 'Nhà bán lẻ', address: '0xc50562C4c1BdC1F7A5690513427cCd3cde40f043' },
    { role: 'NUTRITION_AUTHORITY', name: 'Viện dinh dưỡng', address: '0xA93Fc57Fe3493a91dC4Efe169C63f06A715b6Ba0' },
    { role: 'FOOD_SAFETY_AUTHORITY', name: 'Viện an toàn thực phẩm', address: '0x701249DB5372577e81A1D701d8EA29A78130D407' },
    { role: 'TRANSPORT_AUTHORITY', name: 'Kiểm định vận chuyển', address: '0xDf0f7DF20c4653B57833A4a20CD683B85584C25a' },
  ];

  // Trang thái lô sữa
  const batchStatus = {
    0: "Tạo mới",
    1: "Được duyệt",
    2: "Chế biến",
    3: "Kết thúc"
  };
  // Trang thái sữa
  const milkBoxStatus = {
    0: "Tạo mới",
    1: "Được duyệt",
    2: "Vận chuyển",
    3: "Cửa hàng",
    3: "Được bán",
  };

  // Lấy danh sách tài khoản từ Ganache khi component được mount
  function fetchAccounts() {
    const web3 = new Web3(IPConnectGanache);
    web3.eth.getAccounts()
      .then(function(accounts) {
        setGanacheAccounts(accounts);
      })
      .catch(function(err) {
        console.error('Lỗi khi lấy danh sách account từ Ganache: ', err);
      });
  }

  useEffect(function() {
    // Lấy danh sách tài khoản từ Ganache
    fetchAccounts();
    // Đưa danh sách account vào context
    setAccountList(accountList);
  }, []);

  // Xử lý đăng nhập
  function handleLogin() {
    setError('');
    if (!selectedAccount) {
      setError('Vui lòng chọn tài khoản!');
      return;
    }
    if (ganacheAccounts.includes(selectedAccount)) {
        const account = accountList.find(acc => acc.address === selectedAccount);
        // Lưu account vào context
        setCurrentAccount(account);
        // Trang thái
        setBatchStatus(batchStatus);
        setMilkBoxStatus(milkBoxStatus);
        navigate('/master/trang-chu');
    } else {
      setError('Tài khoản không hợp lệ hoặc không khớp với Ganache.');
    }
  }

  return (
    <div className="container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '2rem', fontSize: '1.875rem' }}>Đăng nhập</h2>
      
      <div className="login-form">
        <div className="form-group" style={{ marginBottom: '2rem' }}>
        <select 
          value={selectedAccount} 
          onChange={function(e) { setSelectedAccount(e.target.value); }}
          className="form-control"
        >
        <option value="">Chọn tài khoản</option>
        {accountList.map(function(acc, index) {
          return (
            <option key={index} value={acc.address}>
              {acc.name} - {acc.role}
            </option>
          );
        })}
      </select>

        <button onClick={handleLogin} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}>
          Đăng nhập
        </button>

        {error && <p className="error mt-4">{error}</p>}
      </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
