import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
export const auth = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      error: '',
    };
  }    

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };


  handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await axios.post('http://43.201.215.174/api/member/sign-in', {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('userId', username);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        // if(response.data.accessToken === localStorage.getItem('accessToken')){
        //   sessionStorage.setItem('loggedIn', 'true');
        //   sessionStorage.setItem('userId', username);

        //   localStorage.setItem('accessToken', response.data.accessToken);
        //   localStorage.setItem('refreshToken', response.data.refreshToken);
        // } else if(response.data.refreshToken === localStorage.getItem('refreshToken')){
        //   localStorage.removeItem('accessToken', response.data.accessToken);
        //   localStorage.setItem('accessToken', response.data.accessToken);

        //   sessionStorage.setItem('loggedIn', 'true');
        //   sessionStorage.setItem('userId', username);
        // } else if(response.data.error === "INVALID_TOKEN"){
        //   localStorage.removeItem('accessToken');
        //   localStorage.removeItem('refreshToken');
        //   alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        // }
        this.setState({ loggedIn: true, error: '' });
        this.props.onLogin(username, response.data.accessToken, response.data.refreshToken);
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error) {
      if (error.response) {
        this.setState({ error: error.response.data.message });
      } else {
        this.setState({ error: '로그인 중 오류가 발생했습니다.' });
      }
    }
  };

  render() {
    if (this.state.loggedIn || sessionStorage.getItem('loggedIn') === 'true') {
      return <Navigate to="/" />;
    }   
    
    return (
      <div className="container mt-5 d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center">로그인</h2>
          {this.state.error && <p className="text-danger">{this.state.error}</p>}
          <form onSubmit={this.handleLogin} className="text-center">
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input
                type="text"
                className="form-control mx-auto"
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChange}
                style={{ maxWidth: '300px', maxHeight: '75px' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                className="form-control mx-auto"
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                style={{ maxWidth: '300px', maxHeight: '75px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">로그인</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
