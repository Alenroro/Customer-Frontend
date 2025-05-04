import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRFill, RiBillFill } from 'react-icons/ri';
import { TbReorder } from 'react-icons/tb';
import './footer.css'; // Ensure this file contains styles for the footer

const Footer = () => {
  const navigate = useNavigate();

  const handleOrderStatus = () => {
    navigate('/orderStatus');
  };

  const handlePayBill = () => {
    navigate('/payment');
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clearing user data and navigating to the login page
   
    navigate('/');
    window.location.reload()
  };

  return (
    <div className="footer-container">
      <div className="footer-item" onClick={handleOrderStatus}>
        <TbReorder size={24} />
        <span>Order Status</span>
      </div>
      <div className="footer-item" onClick={handlePayBill}>
        <RiBillFill size={24} />
        <span>Pay Bill</span>
      </div>
      <div className="footer-item" onClick={handleLogout}>
        <RiLogoutCircleRFill size={24} />
        <span>Log Out</span>
      </div>
    </div>
  );
};

export default Footer;
