import styled from "styled-components";
import ImgBg from "./Bar.png";
import table from "./table.png";
/*
import { Container, Row, Col } from 'react-awesome-styled-grid';
import { MdClose } from 'react-icons/md';
*/

export const MainContainer = styled.div`
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url(${ImgBg});
  height: 100vh;
  background-position: center;
  background-size: cover;
`;

export const Item = styled.div`
  display: flex;
  background: url(${table});
  background-repeat: no-repeat;
  background-position: center;
  justify-content: flex;
  position: relative
  align-items: center;
  height: 700px;
  width: 900px;
  margin-bottom: 1.4%;
  
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
`;

export const Youtube = styled.div`
  position: absolute;
  align-items: left;
`;
