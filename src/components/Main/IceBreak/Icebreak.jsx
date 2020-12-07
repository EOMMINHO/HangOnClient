import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

export const Spot1 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop = "29.5%";
  if (marginLeft === "16%") {
    centerLeft = "33%";
  } else {
    centerLeft = "-17%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      marginTop: counter ? centerTop : marginTop,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      marginTop: counter ? marginTop : centerTop,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Spot2 = ({ width, position, marginLeft, bottom, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerBottom = "38.5%";
  if (marginLeft === "16%") {
    centerLeft = "33%";
  } else {
    centerLeft = "-17%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      bottom: counter ? centerBottom : bottom,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      bottom: counter ? bottom : centerBottom,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Spot3 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop = "21.4%";
  if (marginLeft === "1.5%") {
    centerLeft = "-11.7%";
  } else {
    centerLeft = "13.3%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      marginTop: counter ? centerTop : marginTop,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      marginTop: counter ? marginTop : centerTop,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Spot4 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop = "-5.3%";
  if (marginLeft === "1.5%") {
    centerLeft = "-11.7%";
  } else {
    centerLeft = "13.3%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      marginTop: counter ? centerTop : marginTop,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      marginTop: counter ? marginTop : centerTop,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Spot5 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop = "21.4%";
  if (marginLeft === "1.5%") {
    centerLeft = "38.5%";
  } else {
    centerLeft = "-36.5%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      marginTop: counter ? centerTop : marginTop,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      marginTop: counter ? marginTop : centerTop,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Spot6 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop = "-5.3%";
  if (marginLeft === "1.5%") {
    centerLeft = "38.5%";
  } else {
    centerLeft = "-36.5%";
  }
  const animation = useSpring({
    from: {
      width: width,
      position: position,
      marginLeft: counter ? centerLeft : marginLeft,
      marginTop: counter ? centerTop : marginTop,
    },
    to: {
      width: width,
      position: position,
      marginLeft: counter ? marginLeft : centerLeft,
      marginTop: counter ? marginTop : centerTop,
    },
    config: {
      duration: 500,
    },
    onRest: () => sleep(20000).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}