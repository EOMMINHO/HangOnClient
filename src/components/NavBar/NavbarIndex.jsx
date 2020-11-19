import React from 'react';
import { Nav, NavLink } from './NavbarElements';

const Navbar = () => {
  
  function handleClick () {
    window.location.href = "/";
  }

  return (
      <Nav>
        <NavLink onClick = {handleClick}> Hang On </NavLink>
      </Nav>
  );
};

export default Navbar;
