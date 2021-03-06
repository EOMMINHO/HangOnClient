import styled from "styled-components";

export const Nav = styled.nav`
  background: #000;
  height: 80px;
  display: flex;
  justify-content: center;
  font-size: 3rem;
  color: #fff;
`;
export const NavLink = styled.button`
  color: #fff;
  font-size: 2.5rem;
  background: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  @media screen and (max-width: 400px) {
    position: absolute;
    top: 10px;
    left: 25px;
  }
`;
