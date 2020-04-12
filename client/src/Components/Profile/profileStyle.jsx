import styled from 'styled-components';
import Form from '../Home/FormStyle.jsx';
let Form1 = styled(Form)`
  display: ${props => (props.displayInfo === 'form' ? 'block' : 'none')};
  @media screen and (max-width: 500px) {
    box-sizing: border-box;
    width: 100vw;
    margin-bottom: 4em;
  }
  @media screen and (min-width: 500px) {
    width: 350px;
  }
  margin-top: 3em;
`;
let Cancel = styled.div`
  display: ${props => (props.disapear ? 'block' : 'none')};
  text-align: left;
  color: rgb(1, 57, 59);
  &:hover {
    cursor: pointer;
    color: purple;
    text-decoration: underline;
  }
`;
let Info = styled.div`
  display: ${props => (props.displayInfo === 'info' ? 'block' : 'none')};
  margin: 6em 4em;
`;
let Img1 = styled.img`
  display: ${props => (props.img === 1 && !props.disapear ? 'block' : 'none')};
`;
let Img2 = styled.img`
  display: ${props => (props.img === 2 && !props.disapear ? 'block' : 'none')};
`;
let EditPencil = styled.div`
  position: absolute;
  height: 30px;
  width: 30px;
  top: 250px;
  right: 50px;
  &:hover {
    cursor: ${props => (props.disapear ? 'default' : 'pointer')};
  }
  img {
    height: 100%;
    width: 100%;
  }
`;
let Container = styled.div`
  position: relative;
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 800px;
  min-height: 100%;
`;
let BackgroundImg = styled.div`
  .container {
    width: 100%;
    height: 230px;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;

let ProfileImg = styled.label`
  position: absolute;
  top: 120px;
  left: 50px;
  .container {
    position: relative;
    height: 180px;
    width: 180px;
    &:hover {
      cursor: pointer;
      div {
        display: flex;
      }
    }
    input {
      display: none;
    }
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 5px white solid;
    }
    div {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: none;
      color: white;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      border: white solid 5px;
    }
  }
`;
export {
  ProfileImg,
  BackgroundImg,
  Container,
  EditPencil,
  Img2,
  Img1,
  Info,
  Cancel,
  Form1
};
