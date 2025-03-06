// src/components/Container.jsx
import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
};

export default Container;