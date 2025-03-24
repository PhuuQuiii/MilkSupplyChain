import React, { useState, useEffect, useContext } from 'react';
import './styles/modern.css';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Thay bằng địa chỉ contract triển khai của bạn
const contractAddress = contractAddr;

const MilkBatchList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList, batchStatus, milkBoxStatus } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'
  // Trạng thái lô sữa
  const batchStatusEnum = batchStatus;

  useEffect(() => {
    async function init() {
      // Kết nối với Ganache
      const web3Instance = new Web3(IPConnectGanache);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    }
    init();
  }, []);

  // Lấy danh sách lô sữa dựa trên biến nextBatchId
  const fetchBatches = async () => {
    if (!contract) return;
    setError('');
    try {
      const nextBatchId = await contract.methods.nextBatchId().call({ from: accountAddress });
      let batchList = [];
      // Lấy từ 1 đến nextBatchId-1
      for (let i = 1; i < Number(nextBatchId); i++) {
        const batch = await contract.methods.milkBatches(i).call({ from: accountAddress });
        batchList.push(batch);
      }
      setBatches(batchList);
    } catch (err) {
      setError('Error fetching batches: ' + err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [contract]);

  // Hàm chuyển sang trang duyệt lô sữa
  const handleApprove = (batchId, batchName) => {
    navigate(`/master/lo-sua-duyet?batchId=${batchId}&batchName=${batchName}`);
  };

  // Hàm chuyển sang trang tạo mới lô sữa
  const handleCreateNew = () => {
    navigate('/master/lo-sua');
  };

  return (
    <div className="container fade-in">
      <h2>Danh sách lô sữa</h2>
      {error && <p className="error">{error}</p>}
      <div className="flex gap-4 mb-4">
        <button onClick={fetchBatches} className="btn btn-primary">
          Lấy danh sách lô sữa
        </button>
        <button onClick={handleCreateNew} className="btn btn-secondary">
          Tạo mới
        </button>
      </div>
      {batches.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên lô sữa</th>
                <th>Ngày lấy sữa</th>
                <th>Sản lượng</th>
                <th>Trang trại</th>
                <th>Cơ quan duyệt</th>
                <th>Trạng thái</th>
                {currentAccount.role === 'NUTRITION_AUTHORITY' && (
                <th>Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {batches.map((batch, index) => (
                <tr key={index}>
                  <td className="text-center">{batch.batchId}</td>
                  <td>{batch.batchName}</td>
                  <td>{batch.milkingDate}</td>
                  <td>{batch.volume}</td>
                  <td>{batch.farmOwner}</td>
                  <td>{batch.approvedBy}</td>
                  <td>
                    <span className={`badge ${batch.status === '1' ? 'badge-success' : 'badge-warning'}`}>
                      {batchStatusEnum[batch.status] || ""}
                    </span>
                  </td>
                  {currentAccount.role === 'NUTRITION_AUTHORITY' && (
                  <td className="actions">
                    <button onClick={() => handleApprove(batch.batchId, batch.batchName)} className="btn btn-primary btn-sm">
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
        <p className="error">Không có lô sữa nào.</p>
      )}
    </div>
  );
};

export default MilkBatchList;
