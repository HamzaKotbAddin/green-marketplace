// src/components/Container.jsx
import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="container content-container">
      {children}
    </div>
  );
};

export default Container;
