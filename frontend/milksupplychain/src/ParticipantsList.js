import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';
import './styles/modern.css';

const contractAddress = contractAddr;

const ParticipantsList = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '', name: '', location: '', phone: '', role: '', isActive: true
  });

  const navigate = useNavigate();
  const { currentAccount } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : '';
  console.log("Contract ABI:", contractABI);
  console.log("Contract Address:", contractAddress);
  
  // Khởi tạo Web3 và Contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(IPConnectGanache);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        setError('Lỗi khi khởi tạo Web3 hoặc Smart Contract.', error);
      }
    };
    initWeb3();
  }, []);

  // Lấy danh sách thành phần khi contract đã có dữ liệu
  useEffect(() => {
    if (contract) {
      fetchParticipants();
    }
  }, [contract]);

  const fetchParticipants = async () => {
    if (!contract) {
      setError('Smart contract chưa được khởi tạo.');
      return;
    }
    setError('');
    try {
      const result = await contract.methods.getParticipants().call({ from: accountAddress });
      //setParticipants(result);
      console.log(result);
    } catch (err) {
      setError('Lỗi khi lấy dữ liệu: ' + err.message);
    }
  };

  const handleAddOrEditParticipant = async () => {
    if (!contract || !accountAddress) {
      setError('Vui lòng kết nối ví trước.');
      return;
    }
    
    if (!formData.address || formData.address.trim() === '') {
      setError('Địa chỉ ví không được để trống.');
      return;
    }

    try {
      await contract.methods
        .setParticipant(
          formData.address, 
          formData.name, 
          formData.location, 
          formData.phone, 
          formData.role, 
          formData.isActive
        )
        .send({ from: accountAddress, gas: 5000000 });

      setShowModal(false);
      setFormData({ address: '', name: '', location: '', phone: '', role: '', isActive: true });
      fetchParticipants();
    } catch (err) {
      setError('Lỗi khi xử lý thành phần: ' + err.message);
    }
  };

  const handleEditClick = (participant) => {
    console.log(participant);
    setFormData({ ...participant, address: participant.address });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="container fade-in">
      <h2>Danh sách thành phần tham gia</h2>
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setShowModal(true); setIsEditing(false); setFormData({ address: '', name: '', location: '', phone: '', role: '', isActive: true }); }} className="btn btn-success">
          Thêm thành phần
        </button>
        <button onClick={fetchParticipants} className="btn btn-primary">Làm mới dữ liệu</button>
        <button onClick={() => navigate('/master/trang-chu')} className="btn btn-secondary">Trở về</button>
      </div>
      {error && <p className="error">{error}</p>}
      
      <table className="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Quyền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => (
            <tr key={index}>
              <td>{p.name}</td>
              <td>{p.location}</td>
              <td>{p.phone}</td>
              <td>{p.role}</td>
              <td className="text-center">
                <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button onClick={() => handleEditClick(p)} className="btn btn-warning">Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Sửa thành phần' : 'Thêm thành phần'}</h3>
            <input 
              type="text" 
              placeholder="Địa chỉ ví" 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              disabled={isEditing} 
            />
            <input type="text" placeholder="Tên" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="text" placeholder="Địa chỉ" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            <input type="text" placeholder="Điện thoại" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="text" placeholder="Quyền" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            <label>
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Hoạt động
            </label>
            <div className="flex gap-2">
              <button onClick={handleAddOrEditParticipant} className="btn btn-success">Lưu</button>
              <button onClick={() => setShowModal(false)} className="btn btn-danger">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;
