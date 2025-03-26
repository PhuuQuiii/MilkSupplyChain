import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { useSearchParams, useNavigate } from "react-router-dom";
import contractABI from "./MilkSupplyChainABI.js";
import contractAddr from "./ContractAddress.js";
import IPConnectGanache from "./IPConnectGanache.js";
import { AccountContext } from "./AccountContext";
import "./styles/modern.css";

const contractAddress = contractAddr;

const UpdateMilkBatch = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [batchId, setBatchId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [milkingDate, setMilkingDate] = useState("");
  const [volume, setVolume] = useState("");
  const [selectedAccountFarm, setSelectedAccountFarm] = useState("");
  const [selectedAccountApprove, setSelectedAccountApprove] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchDetails, setBatchDetails] = useState(null);

  const { currentAccount, accountList, batchStatus } =
    useContext(AccountContext);
  const accountAddress = currentAccount
    ? currentAccount.address
    : "Chưa đăng nhập";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(
      contractABI,
      contractAddress
    );
    setContract(contractInstance);

    // Lấy dữ liệu từ query parameters
    const id = searchParams.get("batchId");
    if (id) {
      setBatchId(id);
      // Tự động tìm kiếm nếu có batchId
      if (contractInstance) {
        setTimeout(() => {
          searchMilkBatch(id, contractInstance);
        }, 500);
      }
    }
  }, [searchParams]);

  // Hàm tìm kiếm thông tin lô sữa
  const searchMilkBatch = async (
    idToSearch = batchId,
    contractInstance = contract
  ) => {
    if (!contractInstance || !idToSearch) {
      setError("Vui lòng nhập Batch ID để tìm kiếm");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const details = await contractInstance.methods
        .milkBatches(idToSearch)
        .call();
      setBatchDetails(details);
      setBatchName(details.batchName);
      setMilkingDate(details.milkingDate);
      setVolume(details.volume);
      setSelectedAccountFarm(details.farmOwner);
      setSelectedAccountApprove(details.approvedBy);

      // Kiểm tra điều kiện trạng thái
      const status = parseInt(details.status);
      if (status !== 0) {
        // Không phải Created
        setError('Chỉ có thể sửa lô sữa ở trạng thái "Đã tạo".');
      }
    } catch (err) {
      setError("Không tìm thấy lô sữa với ID này: " + err.message);
      setBatchDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị trạng thái
  const getStatusText = (status) => {
    const statusMap = {
      0: "Đã tạo",
      1: "Đã phê duyệt",
      2: "Đang chế biến",
      3: "Đã hoàn thành",
    };
    return statusMap[status] || "Không xác định";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !batchId ||
      !batchName ||
      !milkingDate ||
      !volume ||
      !selectedAccountFarm ||
      !selectedAccountApprove
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra vai trò
    if (currentAccount.role !== "FARM") {
      setError(
        "Bạn không có quyền thực hiện thao tác này. Chỉ FARM mới được phép sửa lô sữa."
      );
      return;
    }

    // Xác nhận trước khi cập nhật
    const confirmUpdate = window.confirm(
      `Bạn có chắc chắn muốn cập nhật thông tin lô sữa ${batchId}?\n` +
        `- Tên lô: ${batchName}\n` +
        `- Ngày vắt sữa: ${milkingDate}\n` +
        `- Thể tích: ${volume}\n` +
        `- Chủ trang trại: ${selectedAccountFarm}\n` +
        `- Người duyệt: ${selectedAccountApprove}`
    );

    if (!confirmUpdate) return;

    setLoading(true);
    try {
      // Kiểm tra trạng thái lô sữa trước khi cập nhật
      const details = await contract.methods.milkBatches(batchId).call();
      const currentStatus = parseInt(details.status);

      if (currentStatus !== 0) {
        // Không phải Created
        setError('Chỉ có thể sửa lô sữa ở trạng thái "Đã tạo".');
        setLoading(false);
        return;
      }

      const tx = await contract.methods
        .updateMilkBatch(
          batchId,
          batchName,
          milkingDate,
          volume,
          selectedAccountFarm,
          selectedAccountApprove
        )
        .send({ from: accountAddress, gas: 3000000 });

      setMessage("Cập nhật thành công! Tx Hash: " + tx.transactionHash);

      // Refresh thông tin
      searchMilkBatch();
    } catch (err) {
      setError("Lỗi khi cập nhật: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Cập nhật thông tin lô sữa</h2>

      {/* Form tìm kiếm */}
      <div className="card mb-4">
        <div className="form-group">
          <label className="form-label">Batch ID:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="form-control"
              placeholder="Nhập ID lô sữa cần cập nhật"
              required
            />
            <button
              type="button"
              onClick={() => searchMilkBatch()}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>

      {/* Hiển thị thông tin lô sữa */}
      {batchDetails && (
        <div className="card mb-4">
          <h3>Thông tin lô sữa</h3>
          <div className="grid">
            <div>
              <p>
                <strong>ID lô sữa:</strong> {batchDetails.batchId}
              </p>
              <p>
                <strong>Trạng thái hiện tại:</strong>{" "}
                {getStatusText(parseInt(batchDetails.status))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form cập nhật */}
      {batchDetails && parseInt(batchDetails.status) === 0 && (
        <form onSubmit={handleUpdate} className="card">
          <h3>Cập nhật thông tin lô sữa</h3>
          <div className="form-group">
            <label className="form-label">Tên lô sữa:</label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày vắt sữa:</label>
            <input
              type="text"
              value={milkingDate}
              onChange={(e) => setMilkingDate(e.target.value)}
              className="form-control"
              placeholder="dd/mm/yyyy"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Thể tích:</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Chủ trang trại:</label>
            <select
              value={selectedAccountFarm}
              onChange={(e) => setSelectedAccountFarm(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Chọn chủ trang trại</option>
              {accountList.map((acc, index) => (
                <option key={index} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Người duyệt:</label>
            <select
              value={selectedAccountApprove}
              onChange={(e) => setSelectedAccountApprove(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Chọn người duyệt</option>
              {accountList.map((acc, index) => (
                <option key={index} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/master/lo-sua-list")}
              className="btn btn-secondary"
            >
              Quay lại
            </button>
          </div>
        </form>
      )}

      {batchDetails && parseInt(batchDetails.status) !== 0 && (
        <div className="card">
          <p className="error">Lô sữa này không ở trạng thái có thể sửa</p>
          <button
            type="button"
            onClick={() => navigate("/master/lo-sua-list")}
            className="btn btn-secondary"
          >
            Quay lại danh sách
          </button>
        </div>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UpdateMilkBatch;
