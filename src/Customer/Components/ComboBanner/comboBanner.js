import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './comboBanner.css';
import { setUpdatedItems } from '../../../SlicesFolder/Slices/menuSlice';
import { useSelector, useDispatch } from 'react-redux';

const ComboBanner = () => {
  const dispatch = useDispatch();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboData, setComboData] = useState([]);

  const { updatedItems = [] } = useSelector(state => state.menu);
  const {selectedTable } = useSelector(state => state.menu);

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const { data } = await axios.get('https://qr-backend-application.onrender.com/combos/combo');
       
        const comboInfo = data.map(file => ({
          imageUrl: `https://qr-backend-application.onrender.com/combos/image/${file.comboImage}`,
          comboName: file.comboName,
          comboItems: file.comboItems,
          comboPrice: file.comboPrice,
          comboCategoryName: file.comboCategoryName,
          comboType: file.comboType,
          comboId: file._id
        }));

      
        setComboData(comboInfo);
      } catch (error) {
        console.error("Error fetching banner images: ", error);
      }
    };

    fetchBannerImages();
  }, []);

  const handleShowOffcanvas = (combo) => {
    
    setSelectedCombo({ ...combo });
    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleAddComboToCart = () => {
    if (!selectedCombo) return;

    const existingCombo = updatedItems.find(item => item.comboId === selectedCombo.comboId);
    
    let newItems;
    
    if (existingCombo) {
      newItems = updatedItems.map(item =>
        item.comboId === selectedCombo.comboId
          ? { ...item, count: item.count + 1 }
          : item
      );
    } else {
      newItems = [
        ...updatedItems,
        {
          name: selectedCombo.comboName,
          categoryName: selectedCombo.comboCategoryName,
          items: selectedCombo.comboItems,
          type: selectedCombo.comboType,
          price: selectedCombo.comboPrice,
          typeId: selectedCombo.comboId,
          count: 1,
          tableNumber:selectedTable
        }
      ];
    }

    dispatch(setUpdatedItems(newItems));
    handleCloseOffcanvas();
  };

  return (
    <div className="combo-banner-container">
      {comboData.length > 0 ? (
        <Carousel 
          fade
          interval={3000}
          controls={false}
          indicators={false}
          pause={false}
          className="combo-banner-carousel"
        >
          {comboData.map((combo, index) => (
            <Carousel.Item key={index}>
              <img
                src={combo.imageUrl}
                className="d-block w-100 combo-banner-image"
                alt={`Banner ${index + 1}`}
                onClick={() => handleShowOffcanvas(combo)}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No banner images available</p>
      )}

      {selectedCombo && (
        <Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          placement="bottom"
          className="offcanvas-bottom"
        >
          <Offcanvas.Header closeButton>
            <h3 className='comboTitle'>{selectedCombo.comboName}</h3>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div>
              <img 
                src={selectedCombo.imageUrl} 
                alt="Expanded Banner"
                className="selected-combo-image"
              />
            </div>
            <br/>
            
            <div>
              <table className="combo-items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCombo.comboItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4>Combo Price: ₹{selectedCombo.comboPrice}</h4>
              <button 
                className="add-combo-button" 
                onClick={handleAddComboToCart}
              >
                Add Combo
              </button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default ComboBanner;
