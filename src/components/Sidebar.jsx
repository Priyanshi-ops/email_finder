import React from 'react';
import { FiDroplet, FiBriefcase, FiCoffee } from 'react-icons/fi';

const iconMap = {
  FiDroplet: <FiDroplet />,
  FiBriefcase: <FiBriefcase />,
  FiCoffee: <FiCoffee />,
};

const Sidebar = ({ categories, selectedCategory, onSelectCategory, categoryCounts }) => {
  return (
    <div className="sidebar">
      <div className="brand">
        <span>✉️</span>
        <span>Mailbox</span>
      </div>
      
      <ul className="category-list">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          const unreadCount = categoryCounts[category.id] || 0;
          
          return (
            <li
              key={category.id}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="category-item-left">
                <span className="category-icon">{iconMap[category.icon]}</span>
                <span>{category.label}</span>
              </div>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
