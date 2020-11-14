import Navbar from '../NavBar/NavbarIndex';
import {
  IntroContainer,
  IntroContent,
  IntroItems,
  IntroH1,
  IntroP,
  IntroBtn
} from './IntroElement';

const Intro = () => {
  return (
    <IntroContainer>
      <Navbar />
      <IntroContent>
        <IntroItems>
          <IntroH1>Best Online Drinking Web</IntroH1>
          <IntroP>Enjoy Your Party!</IntroP>
          <IntroBtn>Get Started </IntroBtn>
        </IntroItems>
      </IntroContent>
    </IntroContainer>
  );
};

export default Intro;
