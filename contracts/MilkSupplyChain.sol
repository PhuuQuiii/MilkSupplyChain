// SPDX-License-Identifier: FIT
pragma solidity ^0.8.0;

contract MilkSupplyChain {
    // Enum định nghĩa trạng thái của lô sữa
    // - Created: Lô sữa vừa được tạo bởi FARM.
    // - ApprovedByNutrition: Lô sữa đã được phê duyệt bởi NUTRITION_AUTHORITY.
    // - ManufacturerProcessing: Lô sữa đang được chế biến bởi MANUFACTURER.
    // - Processed: Lô sữa đã hoàn thành chế biến.
    enum BatchStatus { Created, ApprovedByNutrition, ManufacturerProcessing, Processed }
    
    // Enum định nghĩa trạng thái của hộp sữa
    // - Created: Hộp sữa vừa được tạo bởi MANUFACTURER.
    // - Approved: Hộp sữa đã được phê duyệt bởi FOOD_SAFETY_AUTHORITY.
    // - InTransit: Hộp sữa đang được vận chuyển bởi DISTRIBUTOR.
    // - ArrivedAtRetailer: Hộp sữa đã đến của RETAILER.
    // - Sold: Hộp sữa đã được bán cho người tiêu dùng.
    enum MilkBoxStatus { Created, Approved, InTransit, ArrivedAtRetailer, Sold }
    
    // Struct Participant lưu thông tin của các bên tham gia chuỗi cung ứng.
    // Lưu ý: Địa chỉ của participant được dùng làm key trong mapping.
    struct Participant {
        string name;       // Tên của participant.
        string location;   // Vị trí (địa chỉ) của participant.
        string phone;      // Số điện thoại liên hệ.
        string role;       // Vai trò của participant (ví dụ: "FARM", "NUTRITION_AUTHORITY", "MANUFACTURER", v.v.).
        bool isActive;     // Trạng thái hoạt động.
    }
    
    // Mapping lưu trữ Participant, key là địa chỉ của participant.
    mapping(address => Participant) public participants;
    // Duyệt toàn bộ mapping participants
    address[] public participantAddresses;
    mapping(address => bool) public participantRegistered;

    // Hàm đăng ký hoặc cập nhật thông tin của một Participant
    function setParticipant(
        address _participant,
        string memory _name,
        string memory _location,
        string memory _phone,
        string memory _role,
        bool _isActive
    ) public {
        if (!participantRegistered[_participant]) {
            participantAddresses.push(_participant);
            participantRegistered[_participant] = true;
        }
        participants[_participant] = Participant(_name, _location, _phone, _role, _isActive);
    }
    
    // Hàm lấy toàn bộ dữ liệu Participant, trả về mảng các struct Participant.
    function getParticipants() public view returns (Participant[] memory) {
        uint256 len = participantAddresses.length;
        Participant[] memory result = new Participant[](len);
        for (uint256 i = 0; i < len; i++) {
            result[i] = participants[participantAddresses[i]];
        }
        return result;
    }
    
    // Struct MilkBatch lưu trữ thông tin của lô sữa.
    // - batchId: Mã định danh của lô sữa (tự động tăng).
    // - batchName: Tên của lô sữa.
    // - milkingDate: Ngày vắt sữa.
    // - volume: Thể tích sữa.
    // - farmOwner: Địa chỉ của trang trại sở hữu (FARM).
    // - approvedBy: Địa chỉ của cơ quan duyệt (NUTRITION_AUTHORITY).
    // - status: Trạng thái của lô sữa theo enum BatchStatus.
    struct MilkBatch {
        uint256 batchId;
        string batchName;
        string milkingDate;
        uint256 volume;
        string farmOwner;
        string approvedBy;
        BatchStatus status;
    }
    mapping(uint256 => MilkBatch) public milkBatches;
    
    // Biến tự động tăng batchId, bắt đầu từ 1.
    uint256 public nextBatchId = 1;
    
    // Struct MilkBox lưu trữ thông tin của hộp sữa.
    // - serialNumber: Số serial định danh hộp sữa.
    // - batchId: Liên kết đến lô sữa (MilkBatch) mà hộp sữa thuộc về.
    // - processingApproved: Trạng thái phê duyệt chế biến (FOOD_SAFETY_AUTHORITY).
    // - transportApproved: Trạng thái phê duyệt vận chuyển (TRANSPORT_AUTHORITY).
    // - distributorAddress: Địa chỉ của nhà phân phối (DISTRIBUTOR) nhận hộp sữa.
    // - status: Trạng thái của hộp sữa theo enum MilkBoxStatus.
    // - owner: Chủ sở hữu hiện tại của hộp sữa (có thể thay đổi theo quá trình chuyển giao).
    // - manufacturer: Địa chỉ của nhà máy sản xuất (MANUFACTURER) tạo ra hộp sữa.
    // - boxName: Tên của hộp sữa.
    // - manufacturingDate: Ngày sản xuất của hộp sữa.
    // - expirationDate: Hạn sử dụng của hộp sữa.
    struct MilkBox {
        string serialNumber;
        uint256 batchId;
        bool processingApproved;
        bool transportApproved;
        string distributorAddress;
        MilkBoxStatus status;
        string owner;
        string manufacturer;
        string boxName;
        string manufacturingDate;
        string expirationDate;
    }
    mapping(string => MilkBox) public milkBoxes;
    
    // Các sự kiện theo dõi các hành động trên chuỗi cung ứng.
    event MilkBatchCreated(uint256 batchId, string batchName, string milkingDate, uint256 volume);
    event MilkBatchApproved(uint256 batchId);
    event MilkBoxCreated(string serialNumber, uint256 batchId);
    event ProcessingBoxApproved(string serialNumber);
    event DistributorUpdated(string serialNumber, string distributor);
    event TransportBoxApproved(string serialNumber);
    event BoxStatusUpdated(string serialNumber, MilkBoxStatus status);
    
    // 1. FARM tạo MilkBatch (batchId tự động tăng).
    function createMilkBatch(
        string memory _batchName,
        string memory _milkingDate,
        uint256 _volume,
        string memory _farmOwner,
        string memory _approvedBy
    ) public {
        // Chỉ cho phép participant có role "FARM" thực hiện.
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("FARM")),
            "Chi cho phep FARM"
        );
        
        uint256 currentBatchId = nextBatchId;
        nextBatchId++;
        
        milkBatches[currentBatchId] = MilkBatch({
            batchId: currentBatchId,
            batchName: _batchName,
            milkingDate: _milkingDate,
            volume: _volume,
            farmOwner: _farmOwner,
            approvedBy: _approvedBy,
            status: BatchStatus.Created
        });
        emit MilkBatchCreated(currentBatchId, _batchName, _milkingDate, _volume);
    }
    
    // 2. NUTRITION_AUTHORITY phê duyệt MilkBatch.
    function approveMilking(uint256 _batchId, string memory _approvedBy) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("NUTRITION_AUTHORITY")),
            "Chi cho phep NUTRITION_AUTHORITY"
        );
        require(milkBatches[_batchId].batchId != 0, "Batch khong ton tai");
        
        MilkBatch storage batch = milkBatches[_batchId];
        batch.approvedBy = _approvedBy;
        batch.status = BatchStatus.ApprovedByNutrition;
        emit MilkBatchApproved(_batchId);
    }
    
    // 3. MANUFACTURER tạo MilkBox từ MilkBatch đã được phê duyệt.
    // Cho phép truyền vào _manufacturer để xác định địa chỉ của nhà máy sản xuất.
    function createMilkBox(
        uint256 _batchId,
        string memory _serialNumber,
        string memory _boxName,
        string memory _manufacturingDate,
        string memory _expirationDate,
        string memory _manufacturer,
        string memory _distributorAddress
    ) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        // Kiểm tra _manufacturer đã được đăng ký và có role MANUFACTURER.
        require(participants[msg.sender].isActive, "Manufacturer khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("MANUFACTURER")),
            "Dia chi khong phai Manufacturer"
        );
        
        require(milkBatches[_batchId].batchId != 0, "Batch khong ton tai");
        // Lô sữa phải khác trạng thái Created (đã được phê duyệt bởi Nutrition).
        require(
            milkBatches[_batchId].status != BatchStatus.Created,
            "Batch chua duoc phe duyet boi Nutrition"
        );
        require(bytes(milkBoxes[_serialNumber].serialNumber).length == 0, "MilkBox da ton tai");
        
        milkBoxes[_serialNumber] = MilkBox({
            serialNumber: _serialNumber,
            batchId: _batchId,
            processingApproved: false,
            transportApproved: false,
            distributorAddress: _distributorAddress,
            status: MilkBoxStatus.Created,
            owner: _manufacturer,
            manufacturer: _manufacturer,
            boxName: _boxName,
            manufacturingDate: _manufacturingDate,
            expirationDate: _expirationDate
        });
        emit MilkBoxCreated(_serialNumber, _batchId);
    }
    
    // 4. FOOD_SAFETY_AUTHORITY phê duyệt MilkBox => processingApproved = true.
    function approveProcessingBox(string memory _serialNumber) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("FOOD_SAFETY_AUTHORITY")),
            "Chi cho phep FOOD_SAFETY_AUTHORITY"
        );
        require(bytes(milkBoxes[_serialNumber].serialNumber).length != 0, "MilkBox khong ton tai");
        
        milkBoxes[_serialNumber].processingApproved = true;
        milkBoxes[_serialNumber].status = MilkBoxStatus.Approved;
        emit ProcessingBoxApproved(_serialNumber);
    }
    
    // 5. DISTRIBUTOR cập nhật MilkBox khi nhận hộp sữa.
    function updateDistributor(string memory _serialNumber, string memory _distributorAddress, string memory _owner) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("DISTRIBUTOR")),
            "Chi cho phep DISTRIBUTOR"
        );
        require(bytes(milkBoxes[_serialNumber].serialNumber).length != 0, "MilkBox khong ton tai");
        
        milkBoxes[_serialNumber].distributorAddress = _distributorAddress;
        milkBoxes[_serialNumber].owner = _owner;
        milkBoxes[_serialNumber].status = MilkBoxStatus.InTransit;
        emit DistributorUpdated(_serialNumber, _owner);
    }
    
    // 6. TRANSPORT_AUTHORITY phê duyệt vận chuyển MilkBox => transportApproved = true.
    function approveTransportBox(string memory _serialNumber) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("TRANSPORT_AUTHORITY")),
            "Chi cho phep TRANSPORT_AUTHORITY"
        );
        require(bytes(milkBoxes[_serialNumber].serialNumber).length != 0, "MilkBox khong ton tai");
        
        milkBoxes[_serialNumber].transportApproved = true;
        emit TransportBoxApproved(_serialNumber);
    }
    
    // 7. RETAILER cập nhật trạng thái MilkBox (chuyển sang ArrivedAtRetailer hoặc Sold).
    function updateBoxStatusAtRetail(string memory _serialNumber, MilkBoxStatus _newStatus) public {
        require(participants[msg.sender].isActive, "Participant khong active");
        require(
            keccak256(bytes(participants[msg.sender].role)) == keccak256(bytes("RETAILER")),
            "Chi cho phep RETAILER"
        );
        require(bytes(milkBoxes[_serialNumber].serialNumber).length != 0, "MilkBox khong ton tai");
        
        milkBoxes[_serialNumber].status = _newStatus;
        emit BoxStatusUpdated(_serialNumber, _newStatus);
    }
    
    // 8. Người tiêu dùng: Lấy thông tin chi tiết của MilkBox và MilkBatch.
    // hàm này trả về một struct MilkBoxDetail gom gọn tất cả thông tin cần thiết.
    function getMilkBoxDetails(string memory _serialNumber) public view returns (MilkBoxDetail memory) {
        MilkBox memory box = milkBoxes[_serialNumber];
        require(bytes(box.serialNumber).length != 0, "MilkBox khong ton tai");
        MilkBatch memory batch = milkBatches[box.batchId];
        MilkBoxDetail memory detail = MilkBoxDetail({
            serialNumber: box.serialNumber,
            batchId: box.batchId,
            processingApproved: box.processingApproved,
            transportApproved: box.transportApproved,
            distributorAddress: box.distributorAddress,
            boxStatus: uint8(box.status),
            owner: box.owner,
            manufacturer: box.manufacturer,
            boxName: box.boxName,
            manufacturingDate: box.manufacturingDate,
            expirationDate: box.expirationDate,
            batchName: batch.batchName,
            milkingDate: batch.milkingDate,
            volume: batch.volume,
            farmOwner: batch.farmOwner,
            approvedBy: batch.approvedBy,
            batchStatus: uint8(batch.status)
        });
        return detail;
    }
    
    // Struct MilkBoxDetail: Gom gọn tất cả thông tin của MilkBox và MilkBatch cần thiết cho người tiêu dùng.
    struct MilkBoxDetail {
        string serialNumber;
        uint256 batchId;
        bool processingApproved;
        bool transportApproved;
        string distributorAddress;
        uint8 boxStatus;
        string owner;
        string manufacturer;
        string boxName;
        string manufacturingDate;
        string expirationDate;
        string batchName;
        string milkingDate;
        uint256 volume;
        string farmOwner;
        string approvedBy;
        uint8 batchStatus;
    }

}
