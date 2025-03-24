import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';
import './styles/modern.css';

const contractAddress = contractAddr;

const MilkBoxManagement = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [milkBoxes, setMilkBoxes] = useState([]);
    const [error, setError] = useState('');
    const [serialNumberSearch, setSerialNumberSearch] = useState('');
    const [additionalSearch, setAdditionalSearch] = useState('');
    const navigate = useNavigate();

    const { currentAccount } = useContext(AccountContext);
    const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

    useEffect(() => {
        const web3Instance = new Web3(IPConnectGanache);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
    }, []);

    const fetchMilkBoxDetails = async () => {
        if (!contract || !serialNumberSearch) return;
        setError('');
        try {
            const details = await contract.methods.getMilkBoxDetails(serialNumberSearch).call({ from: accountAddress });
            setMilkBoxes([{
                serialNumber: details.serialNumber,
                batchId: details.batchId,
                boxName: details.boxName,
                manufacturingDate: details.manufacturingDate,
                expirationDate: details.expirationDate,
                processingApproved: details.processingApproved,
                transportApproved: details.transportApproved,
                boxStatus: details.boxStatus,
                owner: details.owner,
                manufacturer: details.manufacturer,
                distributorAddress: details.distributorAddress,
                batchName: details.batchName,
                milkingDate: details.milkingDate,
                volume: details.volume,
                farmOwner: details.farmOwner,
                approvedBy: details.approvedBy,
                batchStatus: details.batchStatus
            }]);
        } catch (err) {
            setError('Lỗi khi tìm kiếm hộp sữa: ' + err.message);
            console.error(err);
        }
    };

    const handleUpdateStatus = async (serialNumber, newStatus) => {
        if (!contract) return;
        setError('');
        const statusText = newStatus === 3 ? 'đã nhận' : 'đã bán';
        const confirmed = window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái hộp sữa thành "${statusText}" không?`);
        if (!confirmed) return;
        try {
            await contract.methods.updateBoxStatusAtRetail(serialNumber, newStatus)
                .send({ from: accountAddress });
            alert('Trạng thái hộp sữa đã được cập nhật thành công!');
            fetchMilkBoxDetails(); // Refresh the details after update
        } catch (err) {
            setError('Lỗi khi cập nhật trạng thái hộp sữa: ' + err.message);
            console.error(err);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            0: 'Đã tạo',
            1: 'Đã phê duyệt',
            2: 'Đang vận chuyển',
            3: 'Đã đến nhà bán lẻ',
            4: 'Đã bán'
        };
        return statusMap[status] || 'Không xác định';
    };

    return (
        <div className="container fade-in">
            <h2>Quản lý hộp sữa</h2>
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
                <button 
                    onClick={fetchMilkBoxDetails} 
                    className="btn btn-primary mt-4"
                >
                    Tìm kiếm
                </button>
            </div>

            {milkBoxes.length > 0 ? (
                <div>
                    {milkBoxes.map((box, index) => (
                        <div key={index} className="card">
                            <h3>Thông tin hộp sữa</h3>
                            <div className="grid">
                                <div>
                                    <p><strong>Mã hộp sữa:</strong> {box.serialNumber}</p>
                                    <p><strong>Tên sản phẩm:</strong> {box.boxName}</p>
                                    <p><strong>Ngày sản xuất:</strong> {box.manufacturingDate}</p>
                                    <p><strong>Ngày hết hạn:</strong> {box.expirationDate}</p>
                                    <p><strong>Trạng thái:</strong> {getStatusText(parseInt(box.boxStatus))}</p>
                                    <p><strong>Nhà sản xuất:</strong> {box.manufacturer}</p>
                                </div>
                                <div>
                                    <p><strong>Mã lô sữa:</strong> {box.batchId}</p>
                                    <p><strong>Tên lô sữa:</strong> {box.batchName}</p>
                                    <p><strong>Ngày vắt sữa:</strong> {box.milkingDate}</p>
                                    <p><strong>Thể tích:</strong> {box.volume}</p>
                                    <p><strong>Chủ trang trại:</strong> {box.farmOwner}</p>
                                    <p><strong>Người phê duyệt:</strong> {box.approvedBy}</p>
                                </div>
                            </div>
                            {currentAccount.role === 'RETAILER' && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleUpdateStatus(box.serialNumber, 3)}
                                    className="btn btn-secondary"
                                >
                                    Đánh dấu đã nhận
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(box.serialNumber, 4)}
                                    className="btn btn-primary"
                                >
                                    Đánh dấu đã bán
                                </button>
                            </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không tìm thấy thông tin hộp sữa.</p>
            )}
        </div>
    );
};

export default MilkBoxManagement;