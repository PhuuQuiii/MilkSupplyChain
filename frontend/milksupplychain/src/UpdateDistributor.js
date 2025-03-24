import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useSearchParams, useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext';
import './styles/modern.css';

const contractAddress = contractAddr;

const UpdateDistributor = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [batchId, setBatchId] = useState('');
    const [distributorAddress, setDistributorAddress] = useState('');
    const [owner, setOwner] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { currentAccount } = useContext(AccountContext);
    const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const web3Instance = new Web3(IPConnectGanache);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        // Lấy dữ liệu từ query parameters
        const serial = searchParams.get('serialNumber');
        const batch = searchParams.get('batchId');
        const distributor = searchParams.get('distributorAddress');
        const ownerParam = searchParams.get('owner');

        // Gán giá trị vào state
        if (serial) setSerialNumber(serial);
        if (batch) setBatchId(batch);
        if (distributor) setDistributorAddress(distributor);
        setOwner(ownerParam || '');
    }, [searchParams]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!serialNumber || !distributorAddress || !owner) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const tx = await contract.methods.updateDistributor(serialNumber, distributorAddress, owner).send({ from: accountAddress });
            setMessage('Cập nhật thành công! Tx Hash: ' + tx.transactionHash);
        } catch (err) {
            setError('Lỗi khi cập nhật: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="container fade-in">
            <h2>Cập nhật thông tin hộp sữa</h2>
            <form onSubmit={handleUpdate} className="card">
                <div className="form-group">
                    <label className="form-label">Serial Number:</label>
                    <input
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Batch ID:</label>
                    <input
                        type="number"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Địa chỉ Nhà phân phối:</label>
                    <input
                        type="text"
                        value={distributorAddress}
                        onChange={(e) => setDistributorAddress(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Chủ sở hữu:</label>
                    <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="button" onClick={() => navigate('/master/danh-sach-hop-sua-da-kiem-dinh')} className="btn btn-secondary">Quay lại</button>
                </div>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default UpdateDistributor;