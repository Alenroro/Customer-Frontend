import React, { useEffect, useState } from "react";
import axios from "axios";
import "./orderStatus.css"; // Ensure this file includes the necessary CSS
import MenuNavbar from "../CustomerPageNavbar/navBar";
import Footer from "../CustomerPageFooter/footer"; // Use the correct path to your Footer component

const OrderStatus = () => {
  const [allItemsFromFiltered, setAllItemsFromFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentTableNumber = localStorage.getItem("currentTableNumber");

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {  
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/cart/items"
        );
        const cartItems = response.data;

        if (cartItems.length > 0 && currentTableNumber) {
          const filteredItems = cartItems.filter(
            (item) => item.tableNumber === parseInt(currentTableNumber)
          );

          const itemsFromFiltered = filteredItems.flatMap((item) => [
            ...item.items,
            ...item.combos,
          ]);

          setAllItemsFromFiltered(itemsFromFiltered);
          // console.log("Items from filtered: ", itemsFromFiltered) ;
        } else {
          setAllItemsFromFiltered([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [currentTableNumber]);

  if (loading) {
    return <div className="text-center my-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center my-4 text-danger">Error: {error}</div>;
  }

  return (
    <>
      <MenuNavbar />
      <h1 className="order-head">Order Status</h1>
      <div className="container order-cnt">
        {allItemsFromFiltered.length > 0 ? (
          <div className="row">
            {allItemsFromFiltered.map((foodItem, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div
                  className={`card ${
                    foodItem.status === "Served"
                      ? "bg-success text-light"
                      : "bg-danger text-light"
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{foodItem.name}</h5>
                    <p className="card-text text-light">
                      <strong>Count:</strong> {foodItem.count}
                    </p>
                    <p className="card-text text-light">
                      <strong>Status:</strong> {foodItem.status}
                    </p>
                    {foodItem.items && foodItem.items.length > 0 && (
                      <div>
                        <strong>Combo Items:</strong>
                        <ul>
                          {foodItem.items.map((comboItem, comboIndex) => (
                            <li key={comboIndex} style={{ listStyleType: "none" }}>
                              {comboItem.name} - {comboItem.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders for the current table</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderStatus;
