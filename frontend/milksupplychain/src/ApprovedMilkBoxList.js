import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import contractABI from './MilkSupplyChainABI.js';
import contractAddr from './ContractAddress.js';
import IPConnectGanache from './IPConnectGanache.js';
import { AccountContext } from './AccountContext.js';
import './styles/modern.css';

const contractAddress = contractAddr;

const ApprovedMilkBoxList = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [milkBoxes, setMilkBoxes] = useState([]);
    const [error, setError] = useState('');
    const [serialNumberSearch, setSerialNumberSearch] = useState('');
    const navigate = useNavigate();

    const { currentAccount } = useContext(AccountContext);
    const accountAddress = currentAccount ? currentAccount.address : 'Chưa đăng nhập';

    useEffect(() => {
        const web3Instance = new Web3(IPConnectGanache);
        setWeb3(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
    }, []);

    const fetchMilkBoxes = async () => {
        if (!contract) return;
        setError('');
        try {
            const nextBatchId = await contract.methods.nextBatchId().call({ from: accountAddress });
            let boxes = [];
            for (let i = 1; i < Number(nextBatchId); i++) {
                const batch = await contract.methods.milkBatches(i).call({ from: accountAddress });
                if (batch.status === 1) { // Kiểm tra trạng thái "Đã kiểm định"
                    boxes.push(batch);
                }
            }
            setMilkBoxes(boxes);
        } catch (err) {
            setError('Lỗi khi lấy danh sách hộp sữa: ' + err.message);
            console.error(err);
        }
    };

    const fetchMilkBoxDetails = async () => {
        if (!contract || !serialNumberSearch) return;
        setError('');
        try {
            const details = await contract.methods.getMilkBoxDetails(serialNumberSearch).call({ from: accountAddress });
            if (details.processingApproved === true) { // Kiểm tra thuộc tính processingApproved
                setMilkBoxes([details]); // Chỉ hiển thị hộp sữa tìm thấy
            } else {
                setError('Hộp sữa không được phê duyệt.');
            }
        } catch (err) {
            setError('Lỗi khi tìm kiếm hộp sữa: ' + err.message);
            console.error(err);
        }
    };

    const handleApprove = async (serialNumber) => {
        if (!contract) return;
        setError('');
        const confirmed = window.confirm('Bạn có chắc chắn muốn phê duyệt hộp sữa này không?');
        if (!confirmed) return;
        try {
            await contract.methods.approveTransportBox(serialNumber).send({ from: accountAddress });
            alert('Hộp sữa đã được phê duyệt thành công!');
            fetchMilkBoxes(); // Cập nhật lại danh sách sau khi phê duyệt
        } catch (err) {
            setError('CHỉ kiểm định vận chuyển mới được phê duyệt');
            console.error(err);
        }
    };

    const handleEdit = (box) => {
        navigate(`/master/cap-nhat-nha-phan-phoi?serialNumber=${box.serialNumber}&batchId=${box.batchId}&distributorAddress=${box.distributorAddress}&owner=${box.owner}`);
    };

    useEffect(() => {
        fetchMilkBoxes();
    }, [contract]);

    return (
        <div className="container fade-in">
            <h2>Danh sách hộp sữa đã kiểm định</h2>
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
                <button onClick={fetchMilkBoxDetails} className="btn btn-primary mt-4">
                    Tìm kiếm hộp sữa
                </button>
            </div>

            {milkBoxes.length > 0 ? (
                <div className="table-container mt-4">
                <table className="table" >
                    <thead>
                        <tr >
                            <th>Serial Number</th>
                            <th>ID lô sữa</th>
                            <th>Tên sản phẩm</th>
                            <th>Ngày sản xuất</th>
                            <th>Ngày hết hạn</th>
                            <th>Trạng thái</th>
                            {(currentAccount.role === 'TRANSPORT_AUTHORITY'||currentAccount.role === 'DISTRIBUTOR') && (
                            <th>Actions</th>
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
                                <td style={{ padding: "3px" }}>{box.processingApproved === true ? "Đã kiểm định" : "Chưa kiểm định"}</td>
                                <td style={{ padding: "3px", width: "100px", whiteSpace: 'nowrap' }}>
                                    {currentAccount.role === 'DISTRIBUTOR' && (
                                        <button onClick={() => handleEdit(box)} className="btn btn-secondary">
                                            Sửa
                                        </button>
                                    )}
                                    {currentAccount.role === 'TRANSPORT_AUTHORITY' && (
                                        <button onClick={() => handleApprove(box.serialNumber)} className="btn btn-primary">
                                            Duyệt
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <p>Không có hộp sữa nào đã kiểm định.</p>
            )}
        </div>
    );
};

export default ApprovedMilkBoxList;