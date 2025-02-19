import React, { useState } from 'react';

const SortButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOption, setSortOption] = useState({ type: 'likes', order: 'asc' });

  const handleSort = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (type, order) => {
    setSortOption({ type, order });
    setShowDropdown(false);
    // 여기서 정렬 로직을 추가할 수 있습니다.
  };

  return (
    <div className="sort-button-container">
      <button
        className="btn btn-secondary mx-1"
        onClick={handleSort}
      >
        정렬
      </button>
      {showDropdown && (
        <div className="dropdown-menu">
          <button onClick={() => handleOptionClick('likes', 'asc')}>좋아요 오름차순</button>
          <button onClick={() => handleOptionClick('likes', 'desc')}>좋아요 내림차순</button>
          <button onClick={() => handleOptionClick('date', 'asc')}>날짜 오름차순</button>
          <button onClick={() => handleOptionClick('date', 'desc')}>날짜 내림차순</button>
        </div>
      )}
    </div>
  );
};

export default SortButton;
