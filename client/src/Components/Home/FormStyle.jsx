import styled from 'styled-components';

//Styling
let Title = styled.div`
  text-align: left;
  padding: 1em 0;
  h1 {
    font-weight: lighter;
    font-size: 1.5em;
    color: rgb(0, 57, 70);
  }
`;

const Form = styled.form`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  margin: 1em 2em;
  background-color: white;
  padding: 1em;
  width: 350px;
  box-sizing: border-box;
  position: fixed;
  right: 0;
  border-radius: 0;
  height: 100%;
  margin: 0;
  & > * {
    width: 100%;
  }
  .row {
    flex-direction: row;
    justify-content: space-between;
    & > div {
      width: 47%;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    margin: 0.5em 0;
    & > * {
      margin: 0.1em 0;
      &:focus {
        outline: none;
      }
    }
    input {
      font-size: 0.75em;
      padding: 0.75em;
      border: 1px solid lightgrey;
      &:hover {
        border: 1px solid rgb(234, 171, 0);
      }
      &:focus {
        background-color: rgb(250, 242, 232);
        border: 1px solid rgb(234, 171, 0);
      }
    }
    label {
      font-size: 0.5em;
    }
  }
  button {
    background-color: rgb(234, 171, 0);
    border: none;
    color: rgb(0, 57, 70);
    font-size: 0.75em;
    padding: 0.8em;
    margin: 1.5em 0;
    &:focus {
      outline: none;
      background-color: lightgrey;
    }
    &:hover {
      background-color: lightgrey;
      cursor: pointer;
    }
  }
`;

let E = styled.div`
  color: red;
  font-size: 0.75em;
`;

export default Form;
export { Title, E };
