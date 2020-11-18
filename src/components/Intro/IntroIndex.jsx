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
import { Modal } from './Modal';
import { ModalJoin } from './ModalJoin';


const Intro = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(prev => !prev);
  };

  const [showModalJoin, setShowModalJoin] = useState(false);

  const openModalJoin = () => {
    setShowModalJoin(prev => !prev);
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
          <IntroBtn onClick = {openModalJoin}>Join Room</IntroBtn>
          <ModalJoin showModalJoin ={showModalJoin} setShowModalJoin={setShowModalJoin} />
        </IntroItems>
      </IntroContent>
    </IntroContainer>
  );
};


export default Intro;
