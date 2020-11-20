import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
const Joi = require("joi");

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -5%;
  margin-top: -80px;
`;

const ModalWrapper = styled.div`
  width: 600px;
  height: 270px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

const TextBox = styled.input`
  type: text;
  width: 550px;
  height: 40px;
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
`;

export const ModalJoin = ({ showModalJoin, setShowModalJoin }) => {
  const modalRef = useRef();
  const [verified, setVerify] = useState(false);

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModalJoin ? 1 : 0,
    transform: showModalJoin ? `translateY(0%)` : `translateY(-100%)`,
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModalJoin(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModalJoin) {
        setShowModalJoin(false);
        console.log("I pressed");
      }
    },
    [setShowModalJoin, showModalJoin]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const inputSchema = Joi.object({
    userName: Joi.string().min(3).max(64).required(),
  });

  const verifyInput = () => {
    //validate input
    const { error } = inputSchema.validate({
      userName: document.getElementById("userName").value,
    });
    if (error) {
      setVerify(false);
    } else {
      setVerify(true);
    }
  };

  const handleInput = (e) => {
    // Enter to the room
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const getCheckClass = function () {
    if (verified) {
      return "icon is-small is-right has-text-success";
    } else {
      return "icon is-small is-right";
    }
  };

  function handleClick() {
    var user = document.getElementById("userName").value;
    var room = document.getElementById("roomName").value;

    //verify user name
    const { error } = inputSchema.validate({
      userName: user,
    });
    if (error) {
      return alert(error.message);
    }

    sessionStorage.setItem("playerName", user);
    sessionStorage.setItem("roomName", room);
    sessionStorage.setItem("entryType", "join");
    window.location.href = "/room";
  }

  return (
    <>
      {showModalJoin ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showModalJoin={showModalJoin}>
              <ModalContent>
                <div>
                  Username
                  <div className="field">
                    <p className="control has-icons-left has-icons-right">
                      <TextBox
                        className="input"
                        type="text"
                        placeholder="Enter Your Name"
                        id="userName"
                        onChange={verifyInput}
                        onKeyPress={handleInput}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-signature"></i>
                      </span>
                      <span className={getCheckClass()}>
                        <i className="fas fa-check"></i>
                      </span>
                    </p>
                  </div>
                  Room Name
                  <div className="field">
                    <p className="control has-icons-left has-icons-right">
                      <TextBox
                        className="input"
                        type="text"
                        placeholder="Enter the Room Name"
                        id="roomName"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-signature"></i>
                      </span>
                      <span className="icon is-small is-right">
                        <i className="fas fa-check"></i>
                      </span>
                    </p>
                  </div>
                  <div className="has-text-centered">
                    <button className="button" onClick={handleClick}>
                      Join
                    </button>
                  </div>
                </div>
              </ModalContent>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowModalJoin((prev) => !prev)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};
