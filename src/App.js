import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { Transition } from 'react-transition-group'; 
import Header from './header';
import BigContent from './main/bigContent';
import SmallContent from './main/smallContent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  handleLogin = (userId, accessToken, refreshToken) => {
    this.setState({ loggedIn: true, userId});
  };

  handleLogout = () => {
    this.setState({ loggedIn: false, userId: null});
  };

  render() {
    const { loggedIn, userId } = this.state;

    return (
        <div className="App">
          <Header loggedIn={loggedIn} userId={userId} onLogout={this.handleLogout} />
          <SmallContent />
          <div className='container center'>
            <button className="btn btn-primary mx-1">분위기</button>
            <button className="btn btn-primary mx-1">정렬</button>
          </div>
          <BigContent />
        </div>
    );
  }
}

export default App;
