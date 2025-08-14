import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <nav className="nav-links">
        <NavLink to="/home" className="nav-item">Home</NavLink>
        <NavLink to="/login" className="nav-item login-link">Login</NavLink>
      </nav>
    </div>
  );
};

export default Header;
