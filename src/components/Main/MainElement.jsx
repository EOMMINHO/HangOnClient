import styled from 'styled-components';
import ImgBg from './Bar.png';
import table from './table.png'

export const MainContainer = styled.div`
    background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${ImgBg});
    height: 100vh;
    background-position: center;
    background-size: cover;
    justify-content: center;
    align-items: center;
`;

export const Table = styled.div`
    width: 380px;
    height: 408px;
    background: url(${table});
`;

export const menubar = styled.div`
  width: 400px;
  height: 270px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

