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

export const Table = styled.div`
    width: 380px;
    height: 408px;
    background: url(${table});
`;

export const MenuBar = styled.div`
  width: 700px;
  height: 80px;
  position: center;
  background: #fff;
  border-radius: 10px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;  
  margin-top: 24.8%;
  margin-left: 24.8%;
`;

