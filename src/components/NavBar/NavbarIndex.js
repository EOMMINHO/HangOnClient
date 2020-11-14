import React from 'react';
import { Nav, NavLink } from './NavbarElements';
import Intro from '../Intro/IntroIndex'

const Navbar = ({ toggle }) => {
  return (
    <>
      <Nav>
        <NavLink to= {Intro} >Hang On</NavLink>
      </Nav>
    </>
  );
};

export default Navbar;
