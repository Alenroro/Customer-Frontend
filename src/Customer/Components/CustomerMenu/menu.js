import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Carousel, Card, Row, Col, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./menu.css"; // Ensure this file includes the blur effect styles
import {
  setImageUrls,
  setSelectedTable,
  setCategoryImages,
  setFoodItemImages,
  setUpdatedItems,
  setLoading,
  addCombo,
  removeCombo,
} from "../../../SlicesFolder/Slices/menuSlice";
import MenuNavbar from "../CustomerPageNavbar/navBar";
import axios from "axios";
import CategoryListing from "../CategoryListingPage/categoryListing";
import { setSelectedCategory } from "../../../SlicesFolder/Slices/selectedCategorySlice";
import { FaSearch } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import Footer from "../CustomerPageFooter/footer";
import ComboBanner from "../ComboBanner/comboBanner";

// Loader Component
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// Table Selection Popup Component
const TableSelectionPopup = ({ onClose, onTableSelect }) => {
  const handleTableSelect = (event) => {
    const tableNumber = event.target.value;
    onTableSelect(tableNumber);
    onClose(); // Close the popup after selection
  };

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.container}>
        <h2>Select Table Number</h2>
        <select onChange={handleTableSelect} style={popupStyles.select}>
          <option value="">Select Table</option>
          {[...Array(10).keys()].map((i) => (
            <option key={i} value={i + 1}>
              Table {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  select: {
    margin: "10px 0",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
};

// Menu Component
const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    imageUrls,
    selectedTable,
    categoryImages,
    foodItemImages,
    updatedItems,
    loading,
    showBottomNavbar,
    orderedFood,
    selectedCombos,
  } = useSelector((state) => state.menu);

  const [isTableSelected, setIsTableSelected] = useState(!!selectedTable);
  const [selectedType, setSelectedType] = useState(null);
  const selectedCategory = useSelector((state) => state.selectedCategory);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodItems, setFilteredFoodItems] = useState(foodItemImages);
  const [isFixed, setIsFixed] = useState(false);
  const [combos, setCombos] = useState([]);
  const [load, setLoad] = useState(true);

  // Fetch combos from the backend

  useEffect(() => {
    if (!isTableSelected) {
      setIsTableSelected(false);
    }
  }, [isTableSelected]);

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/banner/banners"
        );
        const urls = response.data.map(
          (file) =>
            `https://qr-backend-application.onrender.com/banner/image/${file.fileId}`
        );
        dispatch(setImageUrls(urls));
      } catch (error) {
        console.error("Error fetching banner images: ", error);
      }
    };

    const fetchCategoryImages = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/categories/category"
        );
        const categoryData = response.data.map((item) => ({
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          categoryUrl: `https://qr-backend-application.onrender.com/categories/image/${item.fileId}`,
        }));
        dispatch(setCategoryImages(categoryData));
      } catch (error) {
        console.error("Error fetching category images: ", error);
      }
    };

    const fetchFoodItemsImages = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/menu/stocks"
        );
        const foodItemsData = response.data;
        const urls = foodItemsData.map((item) => ({
          typeName: item.name,
          typeImageUrl: `https://qr-backend-application.onrender.com/files/image/${item.imageId}`,
          typePrice: item.price,
          categoryName: item.categoryName,
          typeId: item._id,
          type: item.type,
          availability: item.availability,
        }));
        dispatch(setFoodItemImages(urls));

        const itemsWithCounts = urls.map((item) => ({
          name: item.typeName,
          count: 0,
          type: item.type,
          price: item.typePrice,
          categoryName: item.categoryName,
          typeId: item.typeId,
          availability: item.availability,
          tableNumber: selectedTable || null,
        }));
        dispatch(setUpdatedItems(itemsWithCounts));
      } catch (error) {
        console.error("Error fetching food item images: ", error);
      }
    };
    const fetchCombos = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/combos/combo"
        );
        setCombos(response.data);
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setLoad(false);
      }
    };
    const fetchData = async () => {
      await Promise.all([
        fetchBannerImages(),
        fetchCategoryImages(),
        fetchFoodItemsImages(),
        fetchCombos(),
      ]);
      dispatch(setLoading(false));
    };

    fetchData();
  }, [selectedTable, loading, dispatch]);

  useEffect(() => {
    // Filter food items based on the search term
    const filtered = foodItemImages.filter((item) =>
      item.typeName.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredFoodItems(filtered);
  }, [searchTerm, foodItemImages]);

  useEffect(() => {
    // Handle scroll event to toggle fixed position
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (load) {
    return <div>loading...</div>;
  }

  const handleCountChange = (itemName, delta) => {
    const newItems = updatedItems.map((item) =>
      item.name === itemName
        ? { ...item, count: Math.max(0, item.count + delta) }
        : item
    );
    dispatch(setUpdatedItems(newItems));
  };

  const handleAddToCart = () => {
    if (orderedFood.length > 0 || combos.length > 0) {
      navigate("/addToCart");
    }
  };

  const handleTableSelect = (tableNumber) => {
    const tableNum = Number(tableNumber);
    if (!isNaN(tableNum)) {
      dispatch(setSelectedTable(tableNum));
      localStorage.setItem("currentTableNumber", tableNum);
      setIsTableSelected(true);
    } else {
      console.error("Invalid table number:", tableNumber);
    }
  };

  const handleCategorySelect = (categoryName) => {
    dispatch(setSelectedCategory(categoryName === "All" ? null : categoryName));
  };

  const handleTypeSelect = (type) => {
    if (selectedType === type) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
    }
  };

  const handleAddCombo = (combo) => {
    dispatch(addCombo(combo));
  };

  const handleRemoveCombo = (comboId) => {
    dispatch(removeCombo(comboId));
  };

  const filteredFoodItemsByCategory = filteredFoodItems.filter(
    (item) =>
      (selectedCategory ? item.categoryName === selectedCategory : true) &&
      (selectedType ? item.type === selectedType : true)
  );

  const filteredcombo = combos.filter((combos) =>
    selectedType ? combos.comboType === selectedType : true
  );

  return (
    <>
      {!isTableSelected ? (
        <TableSelectionPopup
          onClose={() => setIsTableSelected(true)}
          onTableSelect={handleTableSelect}
        />
      ) : (
        <>
          <MenuNavbar />

          {/* Ensure top padding to prevent overlap with fixed navbar */}
          <div style={{ paddingTop: "2px" }}>
            {loading ? (
              <Loader />
            ) : (
              <>
                {/* Banner Section */}
                <div className="carousel-container">
                  {imageUrls.length > 0 ? (
                    <Carousel
                      interval={3000}
                      controls={false}
                      indicators={false}
                      pause={false}
                    >
                      {imageUrls.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={image}
                            className="d-block w-100 food-image"
                            alt={`Food ${index + 1}`}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <p>No banner images available</p>
                  )}
                </div>

                {/* Search Bar */}
                <div
                  style={{
                    position: isFixed ? "fixed" : "relative",
                    top: isFixed ? "0px" : "auto",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#F5F5F5",
                    borderBottom: "1px solid #ddd",
                    boxShadow: isFixed ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
                    transition: "box-shadow 0.3s, background-color 0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd", // Updated border color to a lighter shade
                      borderRadius: "5px",
                      padding: "5px 10px",
                      width: "100%",
                      maxWidth: "400px",
                      margin: "auto",
                      backgroundColor: "#fff", // Changed to white for better visibility
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        padding: "5px",
                        fontSize: "16px",
                        backgroundColor: "transparent", // Ensure the background of input is transparent
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "5px",
                        fontSize: "20px",
                        color: "#007bff",
                      }}
                    >
                      <FaSearch />
                    </button>
                  </div>
                </div>

                {/* Categories Display Section */}
                <CategoryListing />

                {/* Filter Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      margin: "5px",
                      width: "100%",
                      maxWidth: "200px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => handleTypeSelect("Veg")}
                  >
                    Veg
                  </button>
                  <button
                    style={{
                      backgroundColor: "maroon",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      margin: "5px",
                      width: "100%",
                      maxWidth: "200px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => handleTypeSelect("Non Veg")}
                  >
                    Non Veg
                  </button>
                </div>
                <br />

                {/*Combo Banner Section */}
                <ComboBanner />

                <br />

                {/* Food items Section */}
                <div className="food-items-container">
                  <h2>Menu</h2>
                  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {filteredFoodItemsByCategory.map((item, index) => (
                      <Col key={index} className="d-flex align-items-stretch">
                        <Card
                          className={`food-item-card ${
                            item.availability !== "available" ? "blur" : ""
                          }`}
                        >
                          <div className="card-content">
                            <div className="content-left">
                              <div className="item-details">
                                <h3>{item.typeName}</h3>
                                <h4>Price: {item.typePrice}</h4>
                                <h3>
                                  {item.type === "Veg" ? (
                                    <>🟢 Veg</>
                                  ) : (
                                    <>🔴 Non Veg</>
                                  )}
                                </h3>

                                <div className="additional-content"></div>
                              </div>
                              {item.availability === "available" &&
                              updatedItems.find((i) => i.name === item.typeName)
                                ?.count > 0 ? (
                                <div className="counter">
                                  <button
                                    className="button"
                                    onClick={() =>
                                      handleCountChange(item.typeName, -1)
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="count">
                                    {
                                      updatedItems.find(
                                        (i) => i.name === item.typeName
                                      )?.count
                                    }
                                  </span>
                                  <button
                                    className="button"
                                    onClick={() =>
                                      handleCountChange(item.typeName, 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              ) : item.availability === "available" ? (
                                <button
                                  className="add-button"
                                  onClick={() =>
                                    handleCountChange(item.typeName, 1)
                                  }
                                >
                                  Add
                                </button>
                              ) : (
                                <button className="add-button" disabled>
                                  Unavailable
                                </button>
                              )}
                            </div>
                            <div className="content-right">
                              <img
                                src={item.typeImageUrl}
                                alt={item.typeName}
                                className="right-image"
                              />
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* combo */}
                <div className="combo-container">
                  <h2>Combo</h2>
                  <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {filteredcombo.map((combo, index) => {
                      const isComboAdded = selectedCombos[combo._id];
                      const comboCount = isComboAdded
                        ? selectedCombos[combo._id].count
                        : 0;

                      return (
                        <Col key={index} className="d-flex align-items-stretch">
                          <Card
                            className={`combo-item-card ${
                              combo.availability !== "available" ? "blur" : ""
                            }`}
                          >
                            <div className="card-content">
                              <div className="content-left">
                                <div className="combo-details">
                                  <h3>{combo.comboName}</h3>
                                  <div className="item-names">
                                    <p>
                                      <strong>Items:</strong>{" "}
                                      {combo.comboItems.map((item, idx) => (
                                        <span key={idx}>
                                          {item.name} - {item.quantity}
                                          {idx < combo.comboItems.length - 1 &&
                                            ", "}
                                        </span>
                                      ))}
                                    </p>
                                  </div>
                                  <h4>Price: {combo.comboPrice}</h4>
                                  <h3>
                                    {combo.comboType === "Veg" ? (
                                      <>🟢 Veg</>
                                    ) : (
                                      <>🔴 Non Veg</>
                                    )}
                                  </h3>
                                </div>

                                {combo.availability === "available" ? (
                                  comboCount > 0 ? (
                                    <div className="counter">
                                      <button
                                        className="button"
                                        onClick={() =>
                                          handleRemoveCombo(combo._id)
                                        }
                                      >
                                        -
                                      </button>
                                      <span className="count">
                                        {comboCount}
                                      </span>
                                      <button
                                        className="button"
                                        onClick={() => handleAddCombo(combo)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="add-button"
                                      onClick={() => handleAddCombo(combo)}
                                    >
                                      Add
                                    </button>
                                  )
                                ) : (
                                  <button className="add-button" disabled>
                                    Unavailable
                                  </button>
                                )}
                              </div>

                              <div className="content-right">
                                <img
                                  src={`https://qr-backend-application.onrender.com/combos/image/${combo.comboImage}`}
                                  alt={combo.comboName}
                                  className="right-image"
                                />
                              </div>
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>

                <br />
                <br />

                <br />
                <br />
                {/* Bottom Navbar */}
                {showBottomNavbar && (
                  <div style={bottomNavbarStyles.container}>
                    <div style={bottomNavbarStyles.left}>
                      <span>{orderedFood.length} Items added</span>
                    </div>
                    <div style={bottomNavbarStyles.right}>
                      <button
                        style={bottomNavbarStyles.button}
                        onClick={handleAddToCart}
                        disabled={!orderedFood.length}
                      >
                        Cart <PiShoppingCartFill />
                      </button>
                    </div>
                  </div>
                )}

                {/* Sticky Dropdown Button */}
                <div style={dropdownStyles.container}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="btn btn-primary"
                    >
                      Menu 🥗
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleCategorySelect("All")}
                      >
                        All
                      </Dropdown.Item>
                      {categoryImages.map((category) => (
                        <Dropdown.Item
                          key={category.categoryId}
                          onClick={() =>
                            handleCategorySelect(category.categoryName)
                          }
                        >
                          {category.categoryName}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isTableSelected && <Footer />}
    </>
  );
};

const bottomNavbarStyles = {
  container: {
    position: "fixed",
    bottom: "60px",
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  left: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff6f61",
    border: "none",
    color: "white",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

const dropdownStyles = {
  container: {
    position: "fixed",
    bottom: "20%",
    right: "10%",
    zIndex: 1100,
  },
};

export default Menu;
