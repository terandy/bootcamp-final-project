import { createStore } from 'redux';

let reducer = (store, action) => {
  switch (action.type) {
    case 'login':
      return { ...store, login: true };
    default:
      return store;
  }
};

let store = createStore(reducer, { login: false });

export default store;
