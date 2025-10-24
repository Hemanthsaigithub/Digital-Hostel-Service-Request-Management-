import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Digital Hostel Service Request Management
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
