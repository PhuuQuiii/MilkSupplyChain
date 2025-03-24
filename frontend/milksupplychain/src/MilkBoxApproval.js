import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';

// Địa chỉ contract triển khai
const contractAddress = contractAddr;

const MilkBoxApproval = () => {
  // Lấy thông tin sản phẩm từ query string (ví dụ: ?serialNumber=123456)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serialNumber = searchParams.get('serialNumber');
  const boxName = searchParams.get('boxName');

  const { currentAccount, accountList } = useContext(AccountContext);
  const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập'

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
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
    if (!serialNumber) {
        setError('Serial Number không hợp lệ.');
        return;
    }
    if (!privateKey || privateKey.trim() === '') {
      setError('Vui lòng nhập private key.');
      return;
    }
    try {
      const authority = currentAccount.address;

      // Tạo dữ liệu giao dịch: gọi approveProcessingBox(serialNumber)
      const data = contract.methods.approveProcessingBox(serialNumber).encodeABI();
      const gas = await contract.methods.approveProcessingBox(serialNumber).estimateGas({ from: authority });
      const gasPrice = await web3.eth.getGasPrice();
      
      const tx = {
        from: authority,
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice
      };
      
      // Ký giao dịch bằng private key nhập từ giao diện.
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      setMessage('Hộp sữa đã được duyệt thành công. Tx Hash: ' + receipt.transactionHash);
    } catch (err) {
      setError('Lỗi khi duyệt hộp sữa: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Duyệt Hộp Sữa</h2>
      <br></br>
      <p><strong>Serial Number (mã sản phẩm sữa):</strong> {serialNumber}</p>
      <p><strong>Tên sản phẩm sữa:</strong> {boxName}</p>
      <br></br>
      <form onSubmit={handleApproval} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Private Key:</label><br />
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Nhập private key"
            style={{ padding: '0.5rem', width: '500px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}>
          Xét duyệt
        </button>
        <button type="button" onClick={() => navigate('/master/san-pham-sua-list')} style={{ padding: '0.5rem 1rem' }}>
          Quay lại danh sách
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default MilkBoxApproval;
