import React, { useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AccountContext } from "./AccountContext";

function Master() {
  const navigate = useNavigate();
  // Lấy role hoặc name của tài khoản hiện tại
  const { currentAccount, accountList } = useContext(AccountContext);
  const role = currentAccount ? currentAccount.role : "Chưa đăng nhập";
  const name = currentAccount ? currentAccount.name : "";

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="master-layout">
      {/* Header */}
      <div className="header">
        <img
          src={require("./images/logo.png")}
          alt="Sơ đồ chuỗi cung ứng"
          style={{ height: "50px" }}
        />
        <h1 style={{ margin: 0, color: "#00008b" }}>
          Hệ thống Blockchain cho Chuỗi cung ứng sữa
        </h1>
        <div className="user-info">
          <div style={{ fontWeight: "bold", textAlign: "right" }}>
            Đăng nhập:
          </div>
          <div>
            {name} - {role}
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Nội dung chính (Sidebar + Content) */}
      <div className="main-content">
        {/* Sidebar bên trái */}
        <div className="sidebar">
          <ul className="nav-list">
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/trang-chu">Trang chủ</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/thanh-phan-tham-gia">Thành phần tham gia</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/lo-sua-list">Lô sữa</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/san-pham-sua-list">Sản phẩm sữa</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/cap-nhat-san-pham-sua">
                Cập nhật sản phẩm sữa
              </Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/danh-sach-hop-sua-da-kiem-dinh">
                Cập nhật và phê duyệt thông tin hộp sữa
              </Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/nha-ban-le">Cập nhật trạng thái hộp sữa</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/master/truy-xuat-san-pham">Truy xuất nguồn gốc</Link>
            </li>
            <li style={{ marginBottom: "1rem" }}  >
                <Link to="/master/cap-nhat-lo-sua">Cập nhật lô sữa</Link>
              </li>
          </ul>
        </div>

        {/* Khu vực hiển thị trang con */}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div
        className="footer"
        style={{
          color: "#5a6461",
          fontSize: "19px",
        }}
      >
        Ⓒ Bộ môn CNPM - Khoa CÔNG NGHỆ THÔNG TIN
      </div>
    </div>
  );
}

export default Master;
