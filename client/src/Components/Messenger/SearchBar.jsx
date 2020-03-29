import React, { useState } from 'react';
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

//SearchBar is a functional component that takes as props a function.
//This function is called on submission of the form.
let SearchBar = props => {
  let [value, setValue] = useState('');
  let submit = evt => {
    evt.preventDefault();
    props.submitFunction(value);
    setValue('');
  };
  let changeValue = evt => {
    setValue(evt.target.value);
    props.changeValue(evt.target.value);
  };
  return (
    <Form onSubmit={submit}>
      <input
        type="text"
        onChange={changeValue}
        value={value}
        placeholder={props.placeholder}
      />
      <button>
        <img src={'/search.png'} />
      </button>
    </Form>
  );
};

export default SearchBar;
