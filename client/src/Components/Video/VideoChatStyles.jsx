import styled from 'styled-components';
let LilVid = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
  width: ${props =>
    props.size === 'big'
      ? '400px'
      : props.size === 'medium'
      ? '200px'
      : '100px'};
  height: ${props =>
    props.size === 'big'
      ? '200px'
      : props.size === 'medium'
      ? '100px'
      : '50px'};
  transition: ease-in-out 0.3s;
  &:hover {
    cursor: pointer;
  }
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    width: 100%;
  }
`;
let VideoChatPage = styled.div`
  box-sizing: border-box;
  position: relative;
  height: 100%;
  width: 100%;
  .streams {
    height: 100%;
    width: 100%;
    background-color: black;
    .big-vid {
      z-index: 2;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      video {
        width: 100%;
      }
    }
  }
  .options {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 90%;
      transition: ease-in 0.1s;
      &:hover {
        cursor: pointer;
        height: 100%;
      }
    }
  }
`;

export default VideoChatPage;
export { LilVid };
