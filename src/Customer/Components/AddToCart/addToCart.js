import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemCount } from "../../../SlicesFolder/Slices/menuSlice";
import "./addTocart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import MenuNavbar from "../CustomerPageNavbar/navBar";
import { SiTicktick } from "react-icons/si";

Modal.setAppElement("#root");

const AddToCart = () => {
  const dispatch = useDispatch();
  const orderedFood = useSelector((state) => state.menu.orderedFood);
  const selectedTable = useSelector((state) => state.menu.selectedTable);
  const navigate = useNavigate();

  const [postedItems, setPostedItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchPostedItems = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-server.onrender.com/cart/items"
        );
        setPostedItems(response.data.map((item) => item.name));
      } catch (error) {
        console.error("Error fetching posted items: ", error);
      }
    };

    fetchPostedItems();
  }, [modalIsOpen]);

  const handleCountChange = (itemName, delta) => {
    dispatch(updateCartItemCount({ name: itemName, delta }));
  };

  const handleFinalizeCart = async () => {
    if (!selectedTable) {
      alert("Please select a table number before proceeding.");
      return;
    }

    if (orderedFood.length === 0) {
      alert("Your cart is empty. Please add items before proceeding.");
      return;
    }

    // Separate items and combos
    const newItems = orderedFood.filter(
      (item) => item.count > 0 && !postedItems.includes(item.name)
    );

    const items = newItems.filter((item) => item.categoryName !== "combo");
    const combos = newItems.filter((item) => item.categoryName === "combo");

    if (items.length === 0 && combos.length === 0) {
      alert(
        "No new items or combos to add. Please add new items before proceeding."
      );
      return;
    }

    const cartData = {
      tableNumber: Number(selectedTable),
      items: items.map((item) => ({
        _id: item.typeId,
        name: item.name,
        type: item.type,
        count: Number(item.count),
        price: Number(item.price),
        categoryName: item.categoryName,
      })),
      combos: combos.map((item) => ({
        _id: item.typeId,
        name: item.name,
        type: item.type,
        count: Number(item.count),
        price: Number(item.price),
        categoryName: item.categoryName,
        items: item.items,
      })),
    };

    try {
      await axios.post(
        "https://qr-backend-server.onrender.com/cart/cartitems",
        cartData
      );
      setModalIsOpen(true);
      alert("Order Successful");
    } catch (error) {
      console.error("Error adding items to cart: ", error);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleOrderMore = () => {
    handleCloseModal();
    navigate("/");
  };

  const handleOrderStatus = () => {
    navigate("/orderStatus");
  };

  const handlePayBill = () => {
    handleCloseModal();
    navigate("/payment");
  };

  const totalAmount = orderedFood
    .reduce((total, item) => total + item.price * item.count, 0)
    .toFixed(2);
  const totalItems = orderedFood.reduce((total, item) => total + item.count, 0);

  return (
    <>
      <MenuNavbar />
      <div className="container mt-4">
        <h2>Your Cart</h2>
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderedFood.map((item, index) => {
                const itemTotal = (item.price * item.count).toFixed(2);
                return (
                  <tr
                    key={index}
                    style={
                      postedItems.includes(item.name) ? styles.blurredRow : {}
                    }
                  >
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                      <div style={styles.counter}>
                        <button
                          style={styles.button}
                          onClick={() => handleCountChange(item.name, -1)}
                          disabled={item.count <= 0}
                        >
                          -
                        </button>
                        <span style={styles.count}>{item.count}</span>
                        <button
                          style={styles.button}
                          onClick={() => handleCountChange(item.name, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{itemTotal}</td>
                    <td>
                      <button
                        style={styles.removeButton}
                        onClick={() =>
                          handleCountChange(item.name, -item.count)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={styles.summaryContainer}>
          <p>
            <strong>Total Quantity:</strong> {totalItems}
          </p>
          <p>
            <strong>Total Amount:</strong> {totalAmount}
          </p>
        </div>
        <div style={styles.finalizeContainer}>
          <button
            style={styles.finalizeButton}
            onClick={handleFinalizeCart}
            disabled={orderedFood.length === 0}
          >
            Proceed to Order
          </button>
        </div>
      </div>

      {/* Modal for post-order actions */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
      >
        <SiTicktick size={60} /> {/* Increased size of the icon */}
        <br />
        <h2>Order Successfully Placed</h2>
        <p>What would you like to do next?</p>
        <div style={modalButtonContainer}>
          <button
            style={{
              ...modalButton,
              backgroundColor: "green",
              marginRight: "10px",
              flex: 1,
            }}
            onClick={handleOrderMore}
          >
            Order More
          </button>
          <button
            style={{
              ...modalButton,
              backgroundColor: "green",
              marginLeft: "10px",
              flex: 1,
            }}
            onClick={handleOrderStatus}
          >
            Order Status
          </button>
        </div>
        <div style={{ ...modalButtonContainer, marginTop: "20px" }}>
          <button
            style={{ ...modalButton, backgroundColor: "grey", width: "100%" }}
            onClick={handlePayBill}
          >
            Pay Bill
          </button>
        </div>
      </Modal>
    </>
  );
};

const styles = {
  counter: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#ff6f61",
    border: "none",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  count: {
    margin: "0 10px",
    fontSize: "16px",
  },
  removeButton: {
    backgroundColor: "#ff6f61",
    border: "none",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  finalizeContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  finalizeButton: {
    backgroundColor: "#ff6f61",
    border: "none",
    color: "white",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  summaryContainer: {
    marginTop: "20px",
    fontSize: "18px",
  },
  blurredRow: {
    filter: "blur(2px)", // Apply a blur effect to the row
    backgroundColor: "#f0f0f0", // Optional: Change the background color for better visibility
  },
};

const modalStyles = {
  content: {
    top: "15%",
    left: "10%",
    right: "10%",
    bottom: "auto",
    transform: "none",
    padding: "20px",
    borderRadius: "10px",
    width: "80%", // Adjusted width to be 80% of the viewport width
    maxWidth: "800px",
    height: "80%", // Increased height to 80% of the viewport height
    maxHeight: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

const modalButtonContainer = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  gap: "10px", // Added gap between buttons
};

const modalButton = {
  border: "none",
  color: "white",
  padding: "10px 20px",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
};

export default AddToCart;
