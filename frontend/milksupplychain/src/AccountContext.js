// AccountContext.js
import React, { createContext, useState } from 'react';

// Tạo Context
export const AccountContext = createContext();

// Tạo Provider bọc quanh toàn bộ app
export function AccountProvider({ children }) {
  // Lưu toàn bộ danh sách account
  const [accountList, setAccountList] = useState([]);
  // Lưu tài khoản đang đăng nhập
  const [currentAccount, setCurrentAccount] = useState(null);
  // Trang thái lô sữa
  const [batchStatus, setBatchStatus] = useState(null);
  // Trang thái sữa
  const [milkBoxStatus, setMilkBoxStatus] = useState(null);

  return (
    <AccountContext.Provider value={{
      accountList,
      setAccountList,
      currentAccount,
      setCurrentAccount,
      batchStatus, setBatchStatus,
      milkBoxStatus,
      setMilkBoxStatus
    }}>
      {children}
    </AccountContext.Provider>
  );
}
