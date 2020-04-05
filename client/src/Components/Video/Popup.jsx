import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

let PopupStyle = styled.div`
  height: 100vh;
  width: 100vw;
  z-index: 10000;
  color: black;
  border: red;
  position: fixed;
  top: 0;
  left: 0;
  display: ${props => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  h1 {
    background-color: rgba(300, 300, 300, 0.5);
    padding: 1em;
    border-radius: 1em;
    font-size: 1em;
    font-weight: lighter;
  }
`;
let Popup = props => {
  let [show, setShow] = useState(true);
  useEffect(() => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  }, [props.content]);
  return (
    <PopupStyle show={show}>
      <h1>
        {props.person}
        {props.content}
      </h1>
    </PopupStyle>
  );
};
export default Popup;
