import styled from 'styled-components';
import ImgBg from './Bar.png';
import table from './table.png'
import { MdClose } from 'react-icons/md';


export const MainContainer = styled.div`
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${ImgBg});
    height: 100vh;
    background-position: center;
    background-size: cover;
    
`;

export const Item = styled.div`
  display: flex;
  background: url(${table});
  background-repeat: no-repeat;
  background-position: center;
  justify-content: center;
  align-items: center;
  height: 650px;
  width: 660px;
  
`;

export const MenuBar = styled.div`
  width: 700px;
  height: 80px;
  position: center;
  background: #fff;
  border-radius: 10px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;  
  margin-left: 24.8%;
`;

