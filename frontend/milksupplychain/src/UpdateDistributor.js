import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { useSearchParams, useNavigate } from "react-router-dom";
import contractABI from "./MilkSupplyChainABI.js";
import contractAddr from "./ContractAddress.js";
import IPConnectGanache from "./IPConnectGanache.js";
import { AccountContext } from "./AccountContext";
import "./styles/modern.css";

const contractAddress = contractAddr;

const UpdateDistributor = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [batchId, setBatchId] = useState("");
  const [distributorAddress, setDistributorAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [boxDetails, setBoxDetails] = useState(null);

  const { currentAccount } = useContext(AccountContext);
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
    const serial = searchParams.get("serialNumber");
    const batch = searchParams.get("batchId");
    const distributor = searchParams.get("distributorAddress");
    const ownerParam = searchParams.get("owner");

    // Gán giá trị vào state
    if (serial) {
      setSerialNumber(serial);
      // Tự động tìm kiếm nếu có serial
      if (contractInstance) {
        setTimeout(() => {
          searchMilkBox(serial, contractInstance);
        }, 500);
      }
    }
    if (batch) setBatchId(batch);
    if (distributor) setDistributorAddress(distributor);
    setOwner(ownerParam || "");

    // Kiểm tra quyền người dùng
    const checkRole = async () => {
      if (contractInstance && accountAddress !== "Chưa đăng nhập") {
        try {
          const participant = await contractInstance.methods
            .participants(accountAddress)
            .call();
          if (participant.role !== "DISTRIBUTOR") {
            setError(
              "Bạn không có quyền thực hiện chức năng này. Chỉ DISTRIBUTOR mới được phép cập nhật thông tin vận chuyển."
            );
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra quyền:", err);
        }
      }
    };

    checkRole();
  }, [searchParams, accountAddress]);

  // Hàm tìm kiếm thông tin hộp sữa
  const searchMilkBox = async (
    serialToSearch = serialNumber,
    contractInstance = contract
  ) => {
    if (!contractInstance || !serialToSearch) {
      setError("Vui lòng nhập Serial Number để tìm kiếm");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const details = await contractInstance.methods
        .getMilkBoxDetails(serialToSearch)
        .call();
      setBoxDetails(details);
      setBatchId(details.batchId);
      setDistributorAddress(details.distributorAddress || "");
      setOwner(details.owner || "");

      // Kiểm tra điều kiện trạng thái
      const status = parseInt(details.boxStatus);
      if (status !== 1) {
        // Không phải Approved
        setError(
          "Hộp sữa này không ở trạng thái có thể cập nhật phân phối. Trạng thái hiện tại: " +
            getStatusText(status)
        );
      }
    } catch (err) {
      setError("Không tìm thấy hộp sữa với serial number này: " + err.message);
      setBoxDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị trạng thái
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!serialNumber || !distributorAddress || !owner) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra vai trò
    if (currentAccount.role !== "DISTRIBUTOR") {
      setError(
        "Bạn không có quyền thực hiện thao tác này. Chỉ DISTRIBUTOR mới được phép cập nhật thông tin vận chuyển."
      );
      return;
    }

    // Xác nhận trước khi cập nhật
    const confirmUpdate = window.confirm(
      `Bạn có chắc chắn muốn cập nhật thông tin vận chuyển cho hộp sữa ${serialNumber}?\n` +
        `- Nhà phân phối: ${distributorAddress}\n` +
        `- Chủ sở hữu mới: ${owner}\n\n` +
        `Thao tác này sẽ chuyển trạng thái hộp sữa sang "Đang vận chuyển".`
    );

    if (!confirmUpdate) return;

    setLoading(true);
    try {
      // Kiểm tra trạng thái hộp sữa trước khi cập nhật
      const details = await contract.methods
        .getMilkBoxDetails(serialNumber)
        .call();
      const currentStatus = parseInt(details.boxStatus);

      if (currentStatus !== 1) {
        // Không phải Approved
        setError(
          'Chỉ có thể cập nhật thông tin vận chuyển cho hộp sữa ở trạng thái "Đã phê duyệt".'
        );
        setLoading(false);
        return;
      }

      const tx = await contract.methods
        .updateDistributor(serialNumber, distributorAddress, owner)
        .send({ from: accountAddress, gas: 3000000 });
      setMessage("Cập nhật thành công! Tx Hash: " + tx.transactionHash);

      // Refresh thông tin
      searchMilkBox();
    } catch (err) {
      setError("Lỗi khi cập nhật: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Cập nhật thông tin vận chuyển hộp sữa</h2>

      {/* Form tìm kiếm */}
      <div className="card mb-4">
        <div className="form-group">
          <label className="form-label">Serial Number:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="form-control"
              placeholder="Nhập mã hộp sữa cần cập nhật"
              required
            />
            <button
              type="button"
              onClick={() => searchMilkBox()}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>

      {/* Hiển thị thông tin hộp sữa */}
      {boxDetails && (
        <div className="card mb-4">
          <h3>Thông tin hộp sữa</h3>
          <div className="grid">
            <div>
              <p>
                <strong>Mã hộp sữa:</strong> {boxDetails.serialNumber}
              </p>
              <p>
                <strong>Tên sản phẩm:</strong> {boxDetails.boxName}
              </p>
              <p>
                <strong>Trạng thái hiện tại:</strong>{" "}
                {getStatusText(parseInt(boxDetails.boxStatus))}
              </p>
            </div>
            <div>
              <p>
                <strong>Mã lô sữa:</strong> {boxDetails.batchId}
              </p>
              <p>
                <strong>Nhà sản xuất:</strong> {boxDetails.manufacturer}
              </p>
              <p>
                <strong>Chủ sở hữu hiện tại:</strong> {boxDetails.owner}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form cập nhật */}
      {boxDetails && parseInt(boxDetails.boxStatus) === 1 && (
        <form onSubmit={handleUpdate} className="card">
          <h3>Cập nhật thông tin vận chuyển</h3>
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
            <label className="form-label">Chủ sở hữu mới:</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật & Bắt đầu vận chuyển"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/master/danh-sach-hop-sua-da-kiem-dinh")}
              className="btn btn-secondary"
            >
              Quay lại
            </button>
          </div>
        </form>
      )}

      {boxDetails && parseInt(boxDetails.boxStatus) !== 1 && (
        <div className="card">
          <p className="error">
            Hộp sữa này không ở trạng thái có thể cập nhật vận chuyển
          </p>
          <button
            type="button"
            onClick={() => navigate("/master/danh-sach-hop-sua-da-kiem-dinh")}
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

export default UpdateDistributor;
