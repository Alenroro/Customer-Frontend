import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "../Customer/Components/CustomerMenu/menu";
import AddToCart from "../Customer/Components/AddToCart/addToCart";
import OfflinePayment from "../Customer/Components/CustomerPayment/offlinePayment";
import OrderStatus from "../Customer/Components/CustomerOrderStatus/orderStatus";
import PhoneNumberLogin from "../Customer/Components/PhoneNumberLogin/phoneNumberLogin";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/addToCart" element={<AddToCart />} />
      <Route path="/payment" element={<OfflinePayment />} />
      <Route path="/orderStatus" element={<OrderStatus />} />
      <Route path="/login" element={<PhoneNumberLogin />} />
    </Routes>
  </Router>
);

export default AppRoutes;
