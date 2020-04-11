import styled from 'styled-components';
import { SIDE_BAR_WIDTH } from '../../data.js';
const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 70%;
`;
const ImgDiv = styled.div`
  box-sizing: border-box;
  display: flex;
  transition: ease-in-out 0.25s;
  @media screen and (max-width: 800px) {
    width: ${props => props.length * 100 + 'vw'};
    left: ${props =>
      -(props.position / props.length) * props.length * 100 + 'vw'};
  }
  @media screen and (min-width: 800px) {
    width: ${props => props.length * 100 + '%'};
    left: ${props =>
      -(props.position / props.length) * props.length * 100 + '%'};
  }
  height: 100%;
  position: absolute;
  top: 0;
  img {
    @media screen and (max-width: 800px) {
      width: ${props => 100 / props.length + 'vw'};
    }
    @media screen and (min-width: 800px) {
      width: ${props => 100 / props.length + '%'};
    }
    height: 90%;
    object-fit: cover;
    overflow: hidden;
    z-index: 1;
  }
`;
const LeftArrow = styled.div`
  height: 100%;
  @media screen and (max-width: 800px) {
    width: 40vw;
  }
  @media screen and (min-width: 800px) {
    width: 40%;
  }
  left: 0;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  z-index: 2;
  img {
    width: 30px;
    display: ${props => props.toggle};
    filter: invert(1);
    opacity: 65%;
  }
  &:hover {
    cursor: pointer;
  }
`;
const RightArrow = styled(LeftArrow)`
  @media screen and (max-width: 800px) {
    left: 60vw;
  }
  @media screen and (min-width: 800px) {
    left: 60%;
  }
  justify-content: flex-end;
`;
const ImgBall = styled.div`
  position: relative;
  height: 10px;
  width: 10px;
  margin: 10px;
  right: 0;
  bottom: 0;
  border-radius: 1em;
  z-index: 3;
  background-color: ${props => props.bc};
  &:hover {
    cursor: pointer;
  }
`;
const ImgBalls = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  justify-content: center;
  display: flex;
`;

const Slide = styled.div`
  box-sizing: border-box;
  width: 100vw;
  height: 100%;
  display: grid;
  @media screen and (max-width: 800px) {
    grid-template-rows: ${props =>
      props.slideStyle.imgPath ? '1fr 2fr' : '1fr'};
  }
  @media screen and (min-width: 800px) {
    grid-template-columns: ${props =>
      props.slideStyle.imgPath ? '1fr 2fr' : '1fr'};
  }

  background-color: ${props => props.slideStyle.color};
  img {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: ${props => (props.slideStyle.imgPath ? 'block' : 'none')};
  }
  div {
    box-sizing: border-box;
    padding: 2em;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      padding: 1em;
    }
    h1 {
      color: white;
    }
  }
`;
export {
  ImgBalls,
  ImgBall,
  RightArrow,
  LeftArrow,
  ImgDiv,
  SliderContainer,
  Slide
};
