// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import MenuNavbar from '../Navbar/navBar';
// import { updateCartItemCount } from '../../Routes/Slices/menuSlice';
// import './addTocart.css';
// import { useNavigate } from 'react-router-dom';

// const USD_TO_INR_CONVERSION_RATE = 83; // Static conversion rate for demonstration

// const AddToCart = () => {
//     const dispatch = useDispatch();
//     const orderedFood = useSelector(state => state.menu.orderedFood);
//     const navigate = useNavigate();

//     // Helper function to format price in INR
//     const formatPrice = (priceInUSD) => `₹${(priceInUSD * USD_TO_INR_CONVERSION_RATE).toFixed(2)}`;

//     // Calculate total amount and total items in INR
//     const totalAmount = orderedFood.reduce((total, item) => {
//         const itemPriceInUSD = parseFloat(item.price.slice(1)); // Remove currency symbol
//         return total + (itemPriceInUSD * item.count);
//     }, 0);
    
//     const totalItems = orderedFood.reduce((total, item) => total + item.count, 0);

//     const handleCountChange = (itemName, delta) => {
//         dispatch(updateCartItemCount({ name: itemName, delta }));
//     };

//     const handleFinalizeCart = () => {
//         alert("Order Successfully Placed");
//         navigate('/'); // Redirect after successful order
//     };

//     return (
//         <>
//             <MenuNavbar />
//             <div className="container mt-4">
//                 <h2>Your Cart</h2>
//                 <div className="cart-table-container">
//                     <table className="cart-table">
//                         <thead>
//                             <tr>
//                                 <th>Item</th>
//                                 <th>Price</th>
//                                 <th>Quantity</th>
//                                 <th>Total</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orderedFood.map((item, index) => {
//                                 const itemPriceInUSD = parseFloat(item.price.slice(1));
//                                 const itemTotalInINR = formatPrice(itemPriceInUSD * item.count);
//                                 return (
//                                     <tr key={index}>
//                                         <td>{item.name}</td>
//                                         <td>{formatPrice(itemPriceInUSD)}</td>
//                                         <td>
//                                             <div style={styles.counter}>
//                                                 <button
//                                                     style={styles.button}
//                                                     onClick={() => handleCountChange(item.name, -1)}
//                                                     disabled={item.count <= 0} // Disable if count is 0
//                                                 >
//                                                     -
//                                                 </button>
//                                                 <span style={styles.count}>
//                                                     {item.count}
//                                                 </span>
//                                                 <button
//                                                     style={styles.button}
//                                                     onClick={() => handleCountChange(item.name, 1)}
//                                                 >
//                                                     +
//                                                 </button>
//                                             </div>
//                                         </td>
//                                         <td>{itemTotalInINR}</td>
//                                         <td>
//                                             <button
//                                                 style={styles.removeButton}
//                                                 onClick={() => handleCountChange(item.name, -item.count)}
//                                             >
//                                                 Remove
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div style={styles.summaryContainer}>
//                     <p><strong>Total Items:</strong> {totalItems}</p>
//                     <p><strong>Total Amount:</strong> {formatPrice(totalAmount)}</p>
//                 </div>
//                 <div style={styles.finalizeContainer}>
//                     <button 
//                         style={styles.finalizeButton} 
//                         onClick={handleFinalizeCart} 
//                         disabled={orderedFood.length === 0}
//                     >
//                         Proceed to Order
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// const styles = {
//     counter: {
//         display: 'flex',
//         alignItems: 'center',
//         border: '1px solid #ddd',
//         borderRadius: '5px',
//     },
//     button: {
//         backgroundColor: '#ff6f61',
//         border: 'none',
//         color: 'white',
//         padding: '5px 10px',
//         cursor: 'pointer',
//         borderRadius: '5px',
//     },
//     count: {
//         margin: '0 10px',
//         fontSize: '16px',
//     },
//     removeButton: {
//         backgroundColor: '#ff6f61',
//         border: 'none',
//         color: 'white',
//         padding: '5px 10px',
//         cursor: 'pointer',
//         borderRadius: '5px',
//     },
//     finalizeContainer: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         marginTop: '20px',
//     },
//     finalizeButton: {
//         backgroundColor: '#ff6f61',
//         border: 'none',
//         color: 'white',
//         padding: '10px 20px',
//         cursor: 'pointer',
//         borderRadius: '5px',
//         fontSize: '16px',
//     },
//     summaryContainer: {
//         marginTop: '20px',
//         fontSize: '18px',
//     },
// };

// export default AddToCart;





































// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Carousel, Card, Row, Col, Dropdown } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './menu.css';
// import { 
//     setImageUrls, 
//     setCategoryImages, 
//     setFoodItemImages, 
//     setUpdatedItems, 
//     setLoading 
// } from '../../Routes/Slices/menuSlice';
// import MenuNavbar from '../Navbar/navBar';
// import axios from 'axios';

// // Loader Component
// const Loader = () => (
//   <div className="loader-container">
//     <div className="loader"></div>
//   </div>
// );

// const Menu = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {
//     imageUrls,
//     categoryImages,
//     foodItemImages,
//     updatedItems,
//     orderedFood,
//     loading,
//     showBottomNavbar
//   } = useSelector(state => state.menu);

//   useEffect(() => {
//     const fetchBannerImages = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/food/fetchBanner');
//         const urls = response.data.data.map(image => `http://localhost:4000/images/${image.image}`);
//         dispatch(setImageUrls(urls));
//       } catch (error) {
//         console.error("Error fetching banner images: ", error);
//       }
//     };

//     const fetchCategoryImages = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/food/fetchCategory');
//         const responseData = response.data.data;
//         const categoryData = responseData.map(item => ({
//           categoryName: item.categoryName,
//           categoryUrl: `http://localhost:4000/images/${item.categoryImage}`
//         }));
//         dispatch(setCategoryImages(categoryData));
//       } catch (error) {
//         console.error("Error fetching category images: ", error);
//       }
//     };

//     const fetchFoodItemsImages = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/food/fetchType');
//         const foodItemsData = response.data.data;

//         console.log("foodItemsData", foodItemsData);
        
//         const urls = foodItemsData.map(item => ({
//           typeName: item.typeName,
//           typeImageUrl: `http://localhost:4000/images/${item.typeImage}`,
//           typePrice: item.typePrice,
//           categoryId: item.categoryId
//         }));

//         dispatch(setFoodItemImages(urls));
//         console.log("foodItemsData", urls);
        
//         const itemsWithCounts = urls.map(item => ({
//           name: item.typeName,
//           count: 0,
//           price: item.typePrice
//         }));

//         dispatch(setUpdatedItems(itemsWithCounts));
//       } catch (error) {
//         console.error("Error fetching food item images: ", error);
//       }
//     };

//     const fetchData = async () => {
//       await Promise.all([fetchBannerImages(), fetchCategoryImages(), fetchFoodItemsImages()]);
//       dispatch(setLoading(false));
//     };

//     fetchData();
//   }, [loading, dispatch]);

//   // Handle count changes for individual food items
//   const handleCountChange = (itemName, delta) => {
//     const newItems = updatedItems.map(item =>
//       item.name === itemName
//         ? { ...item, count: Math.max(0, item.count + delta) } // Ensure count doesn't go below 0
//         : item
//     );
//     dispatch(setUpdatedItems(newItems));
//   };

//   // Handle adding items to cart
//   const handleAddToCart = () => {
//     const itemsToAdd = updatedItems.filter(item => item.count > 0);
//     if (itemsToAdd.length > 0) {
//       // Assuming there's an action to add items to cart
//       console.log("Items to add to cart:", itemsToAdd);
//       navigate('/addToCart');
//     }
//   };

//   const hasItemsInCart = updatedItems.some(item => item.count > 0);

//   return (
//     <>
//       <MenuNavbar />
//       {loading ? (
//         <Loader /> // Show loader while loading
//       ) : (
//         <>
//           {/* Banner Section */}
//           <div className="carousel-container">
//             {imageUrls.length > 0 ? (
//               <Carousel interval={3000} controls={false} indicators={false} pause={false}>
//                 {imageUrls.map((image, index) => (
//                   <Carousel.Item key={index}>
//                     <img
//                       src={image}
//                       className="d-block w-100 food-image"
//                       alt={`Food ${index + 1}`}
//                     />
//                   </Carousel.Item>
//                 ))}
//               </Carousel>
//             ) : (
//               <p>No banner images available</p>
//             )}
//           </div>
//             <br/>

//           {/* Categories Dropdown Button */}
//           <div className="fixed-middle text-center">
//             <Dropdown className="categories-dropdown mx-auto">
//               <Dropdown.Toggle variant="success" id="dropdown-basic">
//                 Menu
//               </Dropdown.Toggle>

//               <Dropdown.Menu>
//                 {categoryImages.map((category, index) => (
//                   <Dropdown.Item key={index} href={`#${category.categoryName}`}>
//                     {category.categoryName}
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>

//           <hr />
//           <br />

//           {/* Categories Display Section */}
//           <div className="category-container">
//             <div className="category-row">
//               {categoryImages.map((image, index) => (
//                 <div key={index} className="category-item">
//                   <img
//                     src={image.categoryUrl}
//                     alt={image.categoryName}
//                     className="category-image"
//                   />
//                   <div className="category-name">{image.categoryName}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <br />
//           <hr />
//           <br />

//           {/* Food items Section */}
//           <div className="food-items-container">
//             <Row xs={1} sm={2} md={3} lg={4} className="g-4">
//               {updatedItems.map((item, index) => (
//                 <Col key={index} className="d-flex align-items-stretch">
//                   <Card className="food-item-card">
//                     <Card.Img 
//                       variant="top" 
//                       src={foodItemImages.find(img => img.typeName === item.name)?.typeImageUrl} 
//                       className="food-item-image" 
//                       style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
//                     />
//                     <Card.Body>
//                       <Card.Title>{item.name}</Card.Title>
//                       <Card.Text>Price: {item.price}</Card.Text>
//                       <div style={styles.container}>
//                         {item.count > 0 ? (
//                           <div style={styles.counter}>
//                             <button 
//                               style={styles.button} 
//                               onClick={() => handleCountChange(item.name, -1)}
//                             >
//                               -
//                             </button>
//                             <span style={styles.count}>
//                               {item.count}
//                             </span>
//                             <button 
//                               style={styles.button} 
//                               onClick={() => handleCountChange(item.name, 1)}
//                             >
//                               +
//                             </button>
//                           </div>
//                         ) : (
//                           <button 
//                             style={styles.addButton} 
//                             onClick={() => handleCountChange(item.name, 1)}
//                           >
//                             Add
//                           </button>
//                         )}
                       
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </div>

//           {/* Bottom Navbar */}
//           {showBottomNavbar && (
//             <div style={bottomNavbarStyles.container}>
//               <div style={bottomNavbarStyles.left}>
//                 <span>{updatedItems.reduce((total, item) => total + item.count, 0)} Items added</span>
//               </div>
//               <div style={bottomNavbarStyles.right}>
//                 <button 
//                   style={bottomNavbarStyles.button} 
//                   onClick={handleAddToCart}
//                   disabled={!hasItemsInCart}
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   counter: {
//     display: 'flex',
//     alignItems: 'center',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//   },
//   button: {
//     backgroundColor: '#ff6f61',
//     border: 'none',
//     color: 'white',
//     padding: '5px 10px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
//   count: {
//     margin: '0 10px',
//     fontSize: '16px',
//   },
//   addButton: {
//     backgroundColor: '#ff6f61',
//     border: 'none',
//     color: 'white',
//     padding: '5px 15px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   }
// };

// const bottomNavbarStyles = {
//   container: {
//     position: 'fixed',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#fff',
//     borderTop: '1px solid #ddd',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px 20px',
//     boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
//     zIndex: 1000,
//   },
//   left: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//   },
//   right: {
//     display: 'flex',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#ff6f61',
//     border: 'none',
//     color: 'white',
//     padding: '10px 20px',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   }
// };

// export default Menu;
