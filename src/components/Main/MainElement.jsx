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

