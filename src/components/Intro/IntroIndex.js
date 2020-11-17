import React from 'react';
import {
  IntroContainer,
  IntroContent,
  IntroItems,
  IntroH1,
  IntroP,
  IntroBtn
} from './IntroElement';
import { useState } from 'react';
import Navbar from '../NavBar/NavbarIndex';
import HomePage from '../home';
import { Modal } from './Modal';


const Intro = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(prev => !prev);
  };
  return (
    <IntroContainer>
      <Navbar/>
      <IntroContent>
        <IntroItems>
          <IntroH1>Best Online Drinking Web</IntroH1>
          <IntroP>Enjoy Your Party!</IntroP>
          <IntroBtn onClick = {openModal}>Host Room</IntroBtn>
          <Modal showModal ={showModal} setShowModal={setShowModal} />
          <IntroBtn onClick = {openModal}>Join Room</IntroBtn>
          <Modal showModal ={showModal} setShowModal={setShowModal} />
        </IntroItems>
      </IntroContent>
    </IntroContainer>
  );
};


export default Intro;
