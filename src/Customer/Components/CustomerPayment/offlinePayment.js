import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./offlinePayment.css";

const OfflinePayment = () => {
  const [aggregatedItems, setAggregatedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const currentTableNumber = Number(localStorage.getItem("currentTableNumber"));

  useEffect(() => {
    if (!currentTableNumber) {
      console.error("No table number found in local storage.");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://qr-backend-application.onrender.com/cart/items");
        const cartItems = response.data;
       

        // Extract items and combos from the cart items
        const itemsForTable = cartItems
          .filter(item => item.tableNumber === currentTableNumber)
          .flatMap(item => [...item.items, ...item.combos]);

        const aggregated = itemsForTable.reduce((acc, item) => {
          const existingItem = acc.find(i => i.name === item.name);
          if (existingItem) {
            existingItem.count += item.count;
            existingItem.total += Number(item.price) * item.count;
          } else {
            acc.push({
              ...item,
              price: Number(item.price),
              total: Number(item.price) * item.count,
            });
          }
          return acc;
        }, []);

        setAggregatedItems(aggregated);
      

        const total = aggregated.reduce((total, item) => total + item.total, 0);
        setTotalPrice(total);

      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, [currentTableNumber]);

  const goback = () => {
    navigate("/");
  };

  return (
    <div className="invoice-container">
      <h2>Offline Payment Invoice</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Count</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.count}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="total-label">Total</td>
            <td className="total-price">${totalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <button type="button" onClick={goback} className="btn btn-primary">
        Go Back
      </button>
    </div>
  );
};

export default OfflinePayment;
