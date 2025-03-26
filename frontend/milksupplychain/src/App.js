import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Master from "./Master.js";
import Home from "./Home.js";
import ParticipantsList from "./ParticipantsList";
import MilkBatchList from "./MilkBatchList.js";
import MilkBatchForm from "./MilkBatchForm.js";
import MilkBatchApproval from "./MilkBatchApproval";
import MilkBoxForm from "./MilkBoxForm.js";
import MilkBoxList from "./MilkBoxList.js";
import MilkBoxApproval from "./MilkBoxApproval.js";
import TraceMilkProduct from "./TraceMilkProduct";
import UpdateDistributor from "./UpdateDistributor.js";
import ApprovedMilkBoxList from "./ApprovedMilkBoxList.js";
import MilkBoxManagement from "./MilkBoxManagement.js";
import UpdateMilkProduct from "./UpdateMilkProduct.js";
import UpdateMilkBatch from "./UpdateMilkBatch.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/master" element={<Master />}>
        {/* Các route con hiển thị trong <Outlet> của Home */}
        <Route index element={<Home />} />
        <Route path="trang-chu" element={<Home />} />
        <Route path="thanh-phan-tham-gia" element={<ParticipantsList />} />
        <Route path="lo-sua-list" element={<MilkBatchList />} />
        <Route path="tao-lo-sua" element={<MilkBatchForm />} />
        <Route path="cap-nhat-lo-sua" element={<UpdateMilkBatch />} />
        <Route path="lo-sua-duyet" element={<MilkBatchApproval />} />
        <Route path="san-pham-sua" element={<MilkBoxForm />} />
        <Route path="san-pham-sua-list" element={<MilkBoxList />} />
        <Route path="san-pham-sua-duyet" element={<MilkBoxApproval />} />
        <Route path="truy-xuat-san-pham" element={<TraceMilkProduct />} />
        <Route path="cap-nhat-phan-phoi" element={<UpdateDistributor />} />
        <Route
          path="danh-sach-hop-sua-da-kiem-dinh"
          element={<ApprovedMilkBoxList />}
        />
        <Route path="nha-ban-le" element={<MilkBoxManagement />} />
        <Route path="cap-nhat-san-pham-sua" element={<UpdateMilkProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
