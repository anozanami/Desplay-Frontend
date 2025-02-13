import React, { Component } from 'react';
import { Navigate } from 'react-router-dom'; // useNavigate를 Navigate로 수정합니다.
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Transition } from 'react-transition-group';
import { config } from '../config';

const animationTiming = {
  enter: 400,
  exit: 500,
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      verificationCode: '',
      registered: false,
      error: '',
      accessToken: '',
      refreshToken: ''
    };
  }
  

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegister = async (event) => {
    event.preventDefault();
    const { username, password, email } = this.state;

    try {
      const response = await axios.post(config.api+'/api/member/sign-up', {
        username: username, 
        password: password, 
        email: email 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        this.setState({ registered: true, error: '' });
        this.setState({ accessToken: response.data.accessToken, refreshToken: response.data.refreshToken });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 409)) {
        this.setState({ error: error.response.data.message });
      } else {
        this.setState({ error: '회원가입 중 오류가 발생했습니다.' });
      }
    }
  };

  handleSendEmail = async (event) => {
    event.preventDefault();
    const { email } = this.state;
    try {
      const response = await axios.post(config.api+'/api/mail/auth-send', {
        receiverMail: email 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        this.setState({ error: '이메일로 인증번호를 발송했습니다.' });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data.message });
      } else {
        this.setState({ error: '올바른 이메일 주소가 아닙니다.' });
      }
    }
  };

  handleCheckEmail = async (event) => {
    event.preventDefault();
    const { email, verificationCode } = this.state;

    try {
      const response = await axios.post(config.api+'/api/mail/auth-check', {
        receiverMail: email, 
        authNumber: verificationCode 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        this.setState({ error: '이메일 인증에 성공했습니다.' });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data.message });
      } else {
        this.setState({ error: '이메일 인증 확인을 실패했습니다.' });
      }
    }
  };

  render() {
    if (this.state.registered) {
      return (
        <Transition in={this.state.registered} timeout={animationTiming} mountOnEnter unmountOnExit>
          {state => (
            <div style={{
              transition: `opacity ${animationTiming.enter}ms`,
              opacity: state === 'entering' || state === 'entered' ? 1 : 0
            }}>
              <button type="button" className="btn btn-primary mt-3" onClick={<Navigate to="/login"/>}>
                로그인하러 가기
                </button>
              <button type="button" className="btn btn-primary mt-3" onClick={<Navigate to="/"/>}>
                메인화면
                </button>
              <Navigate to="/login" />
            </div>
          )}
        </Transition>
      )
    }

    return (
      <div className="container mt-5 d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center">회원가입</h2>
          {this.state.error && <p className="text-danger">{this.state.error}</p>}
          <form onSubmit={this.handleRegister} className="text-center mt-5">
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                className="form-control mx-auto"
                id="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                style={{ maxWidth: '300px', maxHeight: '75px' }}
              />
              <button type="button" className="btn btn-primary mt-3 mx-3" onClick={this.handleSendEmail}>
                인증번호 보내기
              </button>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="verificationCode">인증번호 입력</label>
              <input
                type="text"
                className="form-control mx-auto"
                id="verificationCode"
                name="verificationCode"
                value={this.state.verificationCode}
                onChange={this.handleInputChange}
                style={{ maxWidth: '300px', maxHeight: '75px' }}
              />
              <button type="button" className="btn btn-primary mt-3 mx-3" onClick={this.handleCheckEmail}>
                인증 확인
              </button>
            </div>
            
            <div className="form-group mt-5">
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

            <div className="form-group mt-5">
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
            <button type="submit" className="btn btn-primary mt-3">회원가입</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
