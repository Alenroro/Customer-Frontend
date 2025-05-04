import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../../../SlicesFolder/Slices/selectedCategorySlice'; 
import './categoryListing.css';

const CategoryListing = () => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { categoryImages } = useSelector(state => state.menu);

  const handleCategorySelect = (categoryName) => {
    dispatch(setSelectedCategory(categoryName));
  };

  const onMouseDown = (e) => {
    const container = containerRef.current;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const onMouseMove = (e) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; 
      container.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      container.style.cursor = 'grab';
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
    };

    container.style.cursor = 'grabbing';
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      className="scroll-container"
      ref={containerRef}
      onMouseDown={onMouseDown}
    >
      <div className="scroll-content">
        {categoryImages.map((category) => (
          <div
            className="item"
            key={category.categoryId}
            onClick={() => handleCategorySelect(category.categoryName)}
          >
            <img
              src={category.categoryUrl}
              alt={category.categoryName}
              className="category-image"
            />
            <div className="category-name">{category.categoryName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListing;
