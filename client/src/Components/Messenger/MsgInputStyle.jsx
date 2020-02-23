import styled from 'styled-components';

let MsgInputStyle = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  border: solid 1px grey;
  align-items: center;
  & > * {
    box-sizing: border-box;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.5em;
    &:hover {
      cursor: pointer;
    }
  }
  button {
    background-color: transparent;
    border: none;
    &:hover {
      cursor: pointer;
    }
  }
  textarea {
    display: flex;
    width: 100%;
    height: auto;
    padding: 1em 1.5em;
    border-radius: 2em;
    background-color: rgb(242, 242, 242);
    border: none;
    resize: none;
    &:focus {
      outline: 0;
    }
  }
`;

export { MsgInputStyle };
