import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Địa chỉ contract triển khai
const contractAddress = contractAddr;

const MilkBatchApproval = () => {
  const { currentAccount, accountList } = useContext(AccountContext);

  // Lấy thông tin batch từ query string (ví dụ: ?batchId=1&batchName=MilkBatch1)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const batchId = searchParams.get('batchId');
  const batchName = searchParams.get('batchName');

  // const [selectedAuthority, setSelectedAuthority] = useState(accountList[0].address);
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  
  useEffect(() => {
    // Sử dụng provider của Ganache
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  }, []);
  
  const handleApproval = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!batchId) {
      setError('Batch ID không hợp lệ.');
      return;
    }
    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }
    
    try {
      // Tên cơ quan duyệt
      const batchName = currentAccount.name || "";
      const authority = currentAccount.address;

      // Tạo dữ liệu giao dịch: gọi hàm approveMilking(batchId)
      const data = contract.methods.approveMilking(batchId, batchName).encodeABI();
      
      // Ước lượng gas và lấy gasPrice
      const gas = await contract.methods.approveMilking(batchId, batchName).estimateGas({ from: authority });
      const gasPrice = await web3.eth.getGasPrice();
      
      // Tạo đối tượng giao dịch
      const tx = {
        from: authority,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };
      
      // Ký giao dịch bằng private key được nhập từ giao diện
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      
      // Gửi giao dịch đã ký
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Lô sữa đã được duyệt thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi duyệt lô sữa: ' + err.message);
      console.error(err);
    }
  };
  
  return (
    <div style={{ padding: '0px' }}>
      <h2>Duyệt lô sữa</h2>
      <br></br>
      <p><strong>ID lô sữa:</strong> {batchId}</p>
      <p><strong>Tên lô sữa:</strong> {batchName}</p>
      <br></br>
      
      <form onSubmit={handleApproval}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Private Key:</label><br/>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập private key"
            style={{ padding: '0.5rem', width: '500px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Xác nhận duyệt
        </button>
        <button type="button" onClick={() => navigate('/master/lo-sua-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại danh sách
        </button>
      </form>
      
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default MilkBatchApproval;
