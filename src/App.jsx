import React from 'react';

let endpoint = async () => {
  let response = await fetch('/ping');
  let responseText = await response.text();
  console.log(responseText);
};
let App = () => {
  return <button onClick={endpoint}>click me</button>;
};

export default App;
