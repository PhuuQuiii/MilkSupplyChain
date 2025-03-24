import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

import './styles/modern.css';

// Thay bằng địa chỉ contract triển khai của bạn
const contractAddress = contractAddr;

const ParticipantsList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy địa chỉ của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'

  useEffect(() => {
    // Khởi tạo web3 sử dụng provider của Ganache
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);

    // Tạo instance contract từ ABI và địa chỉ contract
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);

  // Hàm gọi smart contract để lấy toàn bộ dữ liệu Participant.
  const fetchParticipants = async () => {
    setError('');
    try {
      // Gọi hàm getParticipants() không cần tham số, sử dụng hardcodedAccount.
      const result = await contract.methods.getParticipants().call({ from: accountAddress });
      // result là mảng các struct Participant: mỗi phần tử có các trường: name, location, phone, role, isActive
      setParticipants(result);
    } catch (err) {
      setError('Lỗi khi lấy dữ liệu: ' + err.message);
      console.error(err);
    }
  };

  // Hàm chuyển sang trang Trang chủ
  const backHome = () => {
    navigate('/master/trang-chu');
  };

  return (
    <div className="container fade-in">
      <h2>Danh sách thành phần tham gia</h2>
      <div className="flex gap-4 mb-4">
        <button onClick={fetchParticipants} className="btn btn-primary">
          Làm mới dữ liệu
        </button>
        <button onClick={backHome} className="btn btn-secondary">
          Trở về
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {participants.length > 0 && (
        <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tên thành phần</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.location}</td>
                <td>{p.phone}</td>
                <td>{p.role}</td>
                <td className="text-center"><span className="badge badge-success">{p.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default ParticipantsList;
