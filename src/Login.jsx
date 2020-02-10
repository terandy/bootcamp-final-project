import React, { Component } from 'react';
import { connect } from 'react-redux';

class Login extends Component {
  endpoint = async () => {
    let response = await fetch('/login');
    let responseText = await response.text();
    let responseBody = JSON.parse(responseText);
    console.log(responseBody);
    if (responseBody.success) {
      this.props.dispatch({ type: 'login' });
    }
  };
  render() {
    return (
      <div>
        <button onClick={this.endpoint}>Login</button>
        <div>{this.props.login ? 'logged in!' : ''}</div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { login: state.login };
};
export default connect(mapStateToProps)(Login);
