import styled from "styled-components";
import ImgBg from "./Bar.png";
import table from "./table.png";

export const MainContainer = styled.div`
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url(${ImgBg});
  height: 100vh;
  background-position: center;
  background-size: cover;
`;

export const Table = styled.div`
  width: 600px;
  height: 644.4px;
  background: url(${table});
  background-size: cover;
  position: fixed;
  bottom: 11%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 27%;
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
