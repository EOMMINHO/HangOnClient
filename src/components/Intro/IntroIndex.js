import React from 'react';
import {
  IntroContainer,
  IntroContent,
  IntroItems,
  IntroH1,
  IntroP,
  IntroBtn
} from './IntroElement';
import { useHistory } from 'react-router-dom';


const Intro = () => {
  const history = useHistory();
  const handleClick = () => history.push('/choose');
  return (
    <IntroContainer>
      <IntroContent>
        <IntroItems>
          <IntroH1>Best Online Drinking Web</IntroH1>
          <IntroP>Enjoy Your Party!</IntroP>
          <IntroBtn onClick = {handleClick}>Host Room</IntroBtn>
        </IntroItems>
      </IntroContent>
    </IntroContainer>
  );
};


export default Intro;
