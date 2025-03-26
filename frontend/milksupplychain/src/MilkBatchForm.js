import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Địa chỉ contract triển khai
const contractAddress = contractAddr;

const MilkBatchForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batchName, setBatchName] = useState('');
  const [milkingDate, setMilkingDate] = useState('');
  const [volume, setVolume] = useState('');
  const [selectedAccountFarm, setSelectedAccountFarm] = useState('');
  const [selectedAccountApprove, setSelectedAccountApprove] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!contract) return;
    try {
      // Gọi hàm createMilkBatch trên contract.
      await contract.methods.createMilkBatch(batchName, milkingDate, Number(volume), selectedAccountFarm, selectedAccountApprove)
        .send({ from: accountAddress, gas: 3000000, });
      setMessage('Lô sữa đã được tạo thành công.');
      setBatchName('');
      setMilkingDate('');
      setVolume('');
      setSelectedAccountFarm('');
      setSelectedAccountApprove('');
    } catch (err) {
      setError('Lỗi khi tạo lô sữa: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Tạo / Chỉnh sửa Lô Sữa</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên lô sữa:</label><br/>
          <input 
            type="text" 
            value={batchName} 
            onChange={(e) => setBatchName(e.target.value)} 
            style={{ padding: '0.5rem', width: '300px' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Ngày lấy sữa:</label><br/>
          <input 
            type="text" 
            value={milkingDate} 
            onChange={(e) => setMilkingDate(e.target.value)} 
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '300px' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Sản lượng sữa:</label><br/>
          <input 
            type="number" 
            value={volume} 
            onChange={(e) => setVolume(e.target.value)} 
            style={{ padding: '0.5rem', width: '300px' }} 
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
            <label>Trang trại:</label><br/>
            <select value={selectedAccountFarm} onChange={function(e) { setSelectedAccountFarm(e.target.value); }}
                style={{ width: '320px', padding: '0.5rem' }}
            >
                <option value=""></option>
                {accountList.map(function(acc, index) {
                return (
                    <option key={index} value={acc.name}>
                    {acc.name}
                    </option>
                );
                })}
            </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
            <label>Xét duyệt:</label><br/>
            <select value={selectedAccountApprove} onChange={function(e) { setSelectedAccountApprove(e.target.value); }}
                style={{ width: '320px', padding: '0.5rem' }}
            >
                <option value=""></option>
                {accountList.map(function(acc, index) {
                return (
                    <option key={index} value={acc.name}>
                    {acc.name}
                    </option>
                );
                })}
            </select>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Tạo Lô Sữa
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MilkBatchForm;
