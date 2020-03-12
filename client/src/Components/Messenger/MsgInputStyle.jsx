import styled from 'styled-components';

let MsgInputStyle = styled.form`
  /* box-sizing: border-box; */
  width: 100%;
  display: flex;
  border-top: solid 1px lightgrey;
  padding: 0.5em 0;
  align-items: center;
  background-color: white;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.5em;
    &:hover {
      cursor: pointer;
    }
  }
  img {
    height: 2em;
    margin: 0.5em;
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
