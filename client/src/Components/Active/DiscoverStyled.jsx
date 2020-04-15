import styled from 'styled-components';
let H1 = styled.div`
  h1 {
    color: grey;
    margin: 1em 0 0 0;
    font-size: 1em;
    font-weight: normal;
    display: flex;
    justify-content: center;
  }
`;
let Form = styled.form`
  width: 100%;
  background-color: white;
  border-bottom: 1px solid lightgrey;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    input {
      width: 300px;
      border-bottom: lightgrey 1px solid;
    }
  }
  input {
    height: 50%;
    border: 0;
    width: 0;
    transition: ease-in-out 0.5s;
    border-bottom: transparent 1px solid;
    &:focus {
      outline: 0;
      width: 300px;
      border-bottom: lightgrey 1px solid;
    }
  }
  .button {
    height: 50%;
    &:hover {
      cursor: pointer;
    }
    img {
      height: 100%;
      object-fit: cover;
    }
  }
`;
let Container = styled.div`
  overflow: scroll;
  max-height: 90vh;
  padding-top: 1em;
  .err {
    display: flex;
    justify-content: center;
    color: purple;
  }
`;
let ActiveUserStyle = styled.div`
  background-color: white;
  position: relative;
  border-radius: 0.2em;
  padding: 1em;
  box-shadow: 1px 1px 5px lightgrey;
  margin: 0.5em;
  width: 100px;
  text-align: center;
  button {
    color: white;
    background-color: purple;
    border: none;
    padding: 0.5em;
    &:hover {
      cursor: pointer;
      background-color: darkgrey;
    }
  }
  img {
    border-radius: 50%;
    height: 70px;
    width: 70px;
    object-fit: cover;
    margin-right: 0.5em;
  }
`;
let SearchUserStyle = styled(ActiveUserStyle)`
  display: flex;
  width: 90%;
  align-items: center;
  position: relative;
  .info {
    text-align: left;
    h2 {
      font-size: 20px;
      font-weight: normal;
      margin: 0;
    }
    p {
      font-size: 12px;
      margin: 0;
    }
  }
  img {
    height: 50px;
    width: 50px;
  }
  .cover {
    border-radius: 0.2em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: rgba(1, 1, 10, 0.6);
  }

  &:hover {
    cursor: pointer;
    .cover {
      display: flex;
    }
  }
`;
let ContactUserStyle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 0;
  box-shadow: 1px 1px 5px lightgrey;
  position: relative;
  margin: 0.5em;
  img {
    border-radius: 50%;
    height: 70px;
    width: 70px;
    object-fit: cover;
  }
  &:hover {
    cursor: pointer;
    .cover {
      display: flex;
    }
  }
`;
let ContactCover = styled.div`
  border-radius: 50%;
  padding: 0;
  margin: 0;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  background-color: rgba(1, 1, 10, 0.6);
  width: 100%;
  height: 100%;
  color: white;
  justify-content: center;
  align-items: center;
  h1 {
    color: white;
  }
`;
let Container2 = styled.div`
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  &:hover {
    cursor: pointer;
  }
`;
export default Container;
export {
  Container2,
  ContactCover,
  ContactUserStyle,
  SearchUserStyle,
  ActiveUserStyle,
  Form,
  H1
};
