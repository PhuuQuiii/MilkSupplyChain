import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import contractABI from "./MilkSupplyChainABI.js";
import contractAddr from "./ContractAddress.js";
import IPConnectGanache from "./IPConnectGanache.js";
import { AccountContext } from "./AccountContext.js";
import "./styles/modern.css";

const contractAddress = contractAddr;

const MilkBoxManagement = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [milkBoxes, setMilkBoxes] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [serialNumberSearch, setSerialNumberSearch] = useState("");
  const [additionalSearch, setAdditionalSearch] = useState("");
  const navigate = useNavigate();

  const { currentAccount } = useContext(AccountContext);
  const accountAddress = currentAccount
    ? currentAccount.address
    : "Chưa đăng nhập";

  useEffect(() => {
    const web3Instance = new Web3(IPConnectGanache);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(
      contractABI,
      contractAddress
    );
    setContract(contractInstance);
  }, []);

  const fetchMilkBoxDetails = async () => {
    if (!contract || !serialNumberSearch) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const details = await contract.methods
        .getMilkBoxDetails(serialNumberSearch)
        .call({ from: accountAddress });
      setMilkBoxes([
        {
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
          batchStatus: details.batchStatus,
        },
      ]);
    } catch (err) {
      setError("Lỗi khi tìm kiếm hộp sữa: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (serialNumber, newStatus) => {
    if (!contract) return;
    setError("");
    setMessage("");

    // Kiểm tra quyền của người dùng
    if (currentAccount.role !== "RETAILER") {
      setError(
        "Bạn không có quyền thực hiện thao tác này. Chỉ RETAILER mới được phép cập nhật trạng thái."
      );
      return;
    }

    // Tạo thông báo xác nhận phù hợp với trạng thái
    let confirmMessage = "";
    let successMessage = "";

    if (newStatus === 3) {
      confirmMessage =
        "Bạn có chắc chắn muốn xác nhận đã nhận sữa từ nhà phân phối không?";
      successMessage =
        "Đã cập nhật trạng thái thành công: Đã nhận sữa từ nhà phân phối!";
    } else if (newStatus === 4) {
      confirmMessage =
        "Bạn có chắc chắn muốn xác nhận đã bán sữa cho khách hàng không?";
      successMessage =
        "Đã cập nhật trạng thái thành công: Đã bán sữa cho khách hàng!";
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setLoading(true);
    try {
      // Kiểm tra trạng thái hiện tại để đảm bảo quy trình hợp lệ
      const boxDetails = await contract.methods
        .getMilkBoxDetails(serialNumber)
        .call();
      const currentStatus = parseInt(boxDetails.boxStatus);

      if (newStatus === 3 && currentStatus !== 2) {
        setError(
          "Không thể cập nhật thành Đã nhận. Hộp sữa phải ở trạng thái Đang vận chuyển."
        );
        setLoading(false);
        return;
      }

      if (newStatus === 4 && currentStatus !== 3) {
        setError(
          "Không thể cập nhật thành Đã bán. Hộp sữa phải ở trạng thái Đã nhận từ nhà phân phối."
        );
        setLoading(false);
        return;
      }

      // Thực hiện cập nhật trạng thái
      await contract.methods
        .updateBoxStatusAtRetail(serialNumber, newStatus)
        .send({ from: accountAddress, gas: 3000000 });

      setMessage(successMessage);
      fetchMilkBoxDetails(); // Cập nhật lại thông tin sau khi thành công
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái hộp sữa: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // enum MilkBoxStatus { Created, Approved, InTransit, ArrivedAtRetailer, Sold }
  // Enum định nghĩa trạng thái của hộp sữa
    // - Created: Hộp sữa vừa được tạo bởi MANUFACTURER.
    // - Approved: Hộp sữa đã được phê duyệt bởi FOOD_SAFETY_AUTHORITY.
    // - InTransit: Hộp sữa đang được vận chuyển bởi DISTRIBUTOR.
    // - ArrivedAtRetailer: Hộp sữa đã đến của RETAILER.
    // - Sold: Hộp sữa đã được bán cho người tiêu dùng.
  const getStatusText = (status) => {
    const statusMap = {
      0: "Đã tạo",
      1: "Đã phê duyệt",
      2: "Đang vận chuyển",
      3: "Đã đến nhà bán lẻ",
      4: "Đã bán",
    };
    return statusMap[status] || "Không xác định";
  };

  return (
    <div className="container fade-in">
      <h2>Quản lý hộp sữa</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div className="form-group">
        <label>Serial Number (mã hộp sữa):</label>
        <br />
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
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      {milkBoxes.length > 0 ? (
        <div>
          {milkBoxes.map((box, index) => (
            <div key={index} className="card">
              <h3>Thông tin hộp sữa</h3>
              <div className="grid">
                <div>
                  <p>
                    <strong>Mã hộp sữa:</strong> {box.serialNumber}
                  </p>
                  <p>
                    <strong>Tên sản phẩm:</strong> {box.boxName}
                  </p>
                  <p>
                    <strong>Ngày sản xuất:</strong> {box.manufacturingDate}
                  </p>
                  <p>
                    <strong>Ngày hết hạn:</strong> {box.expirationDate}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {getStatusText(parseInt(box.boxStatus))}
                  </p>
                  <p>
                    <strong>Nhà sản xuất:</strong> {box.manufacturer}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Mã lô sữa:</strong> {box.batchId}
                  </p>
                  <p>
                    <strong>Tên lô sữa:</strong> {box.batchName}
                  </p>
                  <p>
                    <strong>Ngày vắt sữa:</strong> {box.milkingDate}
                  </p>
                  <p>
                    <strong>Thể tích:</strong> {box.volume}
                  </p>
                  <p>
                    <strong>Chủ trang trại:</strong> {box.farmOwner}
                  </p>
                  <p>
                    <strong>Người phê duyệt:</strong> {box.approvedBy}
                  </p>
                </div>
              </div>
              {currentAccount.role === "RETAILER" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUpdateStatus(box.serialNumber, 3)}
                    className="btn btn-secondary"
                    disabled={loading || parseInt(box.boxStatus) !== 2}
                  >
                    {loading ? "Đang cập nhật..." : "Đã nhận từ nhà phân phối"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(box.serialNumber, 4)}
                    className="btn btn-primary"
                    disabled={loading || parseInt(box.boxStatus) !== 3}
                  >
                    {loading ? "Đang cập nhật..." : "Đã bán cho khách hàng"}
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
