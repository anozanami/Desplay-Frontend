import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.js';
import Post from './post/post.js';
import MyPage from './myPage/myPage.js';
import Information from './info/information.js';
import Login from './main/login.js';
import Register from './main/register.js';

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      userId: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  handleLogin = (userId, accessToken, refreshToken) => {
    this.setState({ loggedIn: true, userId, accessToken, refreshToken });
  };

  handleLogout = () => {
    this.setState({ loggedIn: false, userId: null, accessToken: null, refreshToken: null });
  };

  render() {
    const { loggedIn } = this.state;
    const userId = sessionStorage.getItem("userId");

    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App loggedIn={loggedIn} userId={userId}/>} />
          <Route path='/post' element={<Post />} />
          <Route path='/mypage/:id' element={<MyPage />} />
          <Route path='/information/:id' element={<Information />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default Router;
