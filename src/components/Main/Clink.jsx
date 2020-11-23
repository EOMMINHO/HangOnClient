import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";

export const Move1 = ({ width, position, marginLeft, marginTop, contents }) => {
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
      duration: 1000,
    },
    onRest: () => sleep(500).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Move2 = ({ width, position, marginLeft, bottom, contents }) => {
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
      duration: 1000,
    },
    onRest: () => sleep(500).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Move3 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop;
  if (marginLeft === "1.5%") {
    centerLeft = "13.75%";
  } else {
    centerLeft = "-10%";
  }
  if (marginTop === "3.7%") {
    centerTop = "17.6%";
  } else {
    centerTop = "-5.45%";
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
      duration: 1000,
    },
    onRest: () => sleep(500).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}

export const Move4 = ({ width, position, marginLeft, marginTop, contents }) => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const [counter, setCounter] = useState(false);
  var centerLeft;
  var centerTop;
  if (marginLeft === "1.5%") {
    centerLeft = "13.75%";
  } else {
    centerLeft = "0.3%";
  }
  if (marginTop === "3.7%") {
    centerTop = "17.6%";
  } else {
    centerTop = "-5.45%";
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
      duration: 1000,
    },
    onRest: () => sleep(500).then(() => setCounter(true)),
  });
  return (
    <td>
      <animated.div style={animation}>
          {contents}
      </animated.div>
    </td>
  );
}