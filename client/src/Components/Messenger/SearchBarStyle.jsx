import styled from 'styled-components';

let Form = styled.form`
  border: solid lightgrey 1px;
  border-radius: 2em;
  padding: 0.25em 1em;
  display: grid;
  grid-template-columns: 1fr 1em;
  input {
    border: none;
    font-size: 0.75em;
    &:focus {
      outline: 0;
    }
  }
  button {
    border: none;
    padding: 0;
    img {
      width: 100%;
    }
    &:focus {
      outline: 0;
    }
    &:hover {
      cursor: pointer;
    }
  }
`;

export default Form;
