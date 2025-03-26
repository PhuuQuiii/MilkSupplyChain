import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';
import './styles/modern.css';

const contractAddress = contractAddr;

const MilkBoxList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [milkBoxes, setMilkBoxes] = useState([]);
  const [error, setError] = useState('');
  const [serialNumberSearch, setSerialNumberSearch] = useState('');
  const navigate = useNavigate();

  const { currentAccount, accountList, milkBoxStatus } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';
  const milkBoxStatusEnum = milkBoxStatus;

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  const fetchMilkBoxes = async () => {
    if (!contract || !serialNumberSearch) return;
    setError('');
    try {
      const details = await contract.methods.getMilkBoxDetails(serialNumberSearch).call({ from: accountAddress });
      setMilkBoxes([details]);
    } catch (err) {
      setError('Lỗi khi tìm kiếm hộp sữa: ' + err.message);
      console.error(err);
    }
  };

  const handleApprove = (serial, boxName) => {
    navigate(`/master/san-pham-sua-duyet?serialNumber=${serial}&boxName=${boxName}`);
  };

  return (
    <div className="container fade-in">
      <h2>Danh sách hộp sữa</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="form-group">
        <label>Serial Number (mã hộp sữa):</label><br/>
        <input
          type="text"
          value={serialNumberSearch}
          onChange={(e) => setSerialNumberSearch(e.target.value)}
          placeholder="Nhập mã hộp sữa"
          className="form-control"
          required
        />
        <div className="flex gap-4 mb-4">
          <button 
            onClick={fetchMilkBoxes} 
            className="btn btn-primary mt-4"
          >
            Tìm kiếm hộp sữa
          </button>
          {currentAccount.role === 'MANUFACTURER' && (
            <button 
              onClick={() => navigate('/master/san-pham-sua')} 
              className="btn btn-secondary mt-4"
            >
              Tạo mới hộp sữa
            </button>
          )}
        </div>
      </div>

      {milkBoxes.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>ID lô sữa</th>
                <th>Tên sản phẩm</th>
                <th>Ngày sản xuất</th>
                <th>Ngày hết hạn</th>
                <th>Trạng thái</th>
                {currentAccount.role === 'FOOD_SAFETY_AUTHORITY' && (
                  <th>Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {milkBoxes.map((box, index) => (
                <tr key={index}>
                  <td style={{ padding: "3px" }}>{box.serialNumber}</td>
                  <td style={{ padding: "3px", textAlign: "center" }}>{box.batchId}</td>
                  <td style={{ padding: "3px" }}>{box.boxName}</td>
                  <td style={{ padding: "3px" }}>{box.manufacturingDate}</td>
                  <td style={{ padding: "3px" }}>{box.expirationDate}</td>
                  <td style={{ padding: "3px" }}>
                    <span className={`badge ${box.boxStatus === '1' ? 'badge-success' : 'badge-warning'}`}>
                      {milkBoxStatusEnum[box.boxStatus] || ""}
                    </span>
                  </td>
                  {currentAccount.role === 'FOOD_SAFETY_AUTHORITY' && (
                    <td style={{ padding: "3px" }} className="actions">
                      <button 
                        onClick={() => handleApprove(box.serialNumber, box.boxName)}
                        className="btn btn-primary btn-sm"
                      >
                        Duyệt
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="error">Không có hộp sữa nào.</p>
      )}
    </div>
  );
};

export default MilkBoxList;
