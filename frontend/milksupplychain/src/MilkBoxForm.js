import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate, useSearchParams } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Địa chỉ contract
const contractAddress = contractAddr;

const MilkBoxForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [batchId, setBatchId] = useState('');
  const [boxName, setBoxName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [selectedManufacturing, setSelectedManufacturing] = useState('');
  const [selectedDistributorAddress, setSelectedDistributorAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialQuery = searchParams.get('serialNumber'); // Nếu có, chuyển chế độ chỉnh sửa (edit)

  // Nhà máy sản xuất:
  const { currentAccount, accountList } = useContext(AccountContext);
  const manufacturerAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'

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
      // Gọi hàm createMilkBox trên contract:
      await contract.methods.createMilkBox(batchId, serialNumber, boxName, manufacturingDate, expirationDate, selectedManufacturing, selectedDistributorAddress)
        .send({ from: manufacturerAddress, gas: 500000 });
      setMessage('Hộp sữa đã được tạo thành công.');
      // Reset form
      setSerialNumber('');
      setBatchId('');
      setBoxName('');
      setManufacturingDate('');
      setExpirationDate('');
      setSelectedManufacturing("");
      setSelectedDistributorAddress("");
    } catch (err) {
      setError('Lỗi khi tạo hộp sữa: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0px' }}>
      <h2>{serialQuery ? 'Chỉnh sửa hộp sữa' : 'Tạo hộp sữa mới'}</h2>
      {error && <p style={{ color: 'red', marginTop: "30px" }}>{error}</p>}
      {message && <p style={{ color: 'green', marginBottom: "10px" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Batch ID (lô sữa):</label><br/>
          <input
            type="number"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Serial Number (mã hộp sữa):</label><br/>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Tên Hộp Sữa:</label><br/>
          <input
            type="text"
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            style={{ padding: '0.5rem', width: '400px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Ngày sản xuất:</label><br/>
          <input
            type="text"
            value={manufacturingDate}
            onChange={(e) => setManufacturingDate(e.target.value)}
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Hạn sử dụng:</label><br/>
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="dd/mm/yyyy"
            style={{ padding: '0.5rem', width: '200px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
            <label>Nhà sản xuất:</label><br/>
            <select value={selectedManufacturing} onChange={function(e) { setSelectedManufacturing(e.target.value); }}
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
            <label>Nhà phân phối:</label><br/>
            <select value={selectedDistributorAddress} onChange={function(e) { setSelectedDistributorAddress(e.target.value); }}
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
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          {serialQuery ? 'Cập nhật hộp sữa' : 'Tạo hộp sữa'}
        </button>
        <button type="button" onClick={() => navigate('/master/san-pham-sua-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại Danh sách
        </button>
      </form>
    </div>
  );
};

export default MilkBoxForm;
