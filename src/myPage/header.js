import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Nav } from 'react-bootstrap';
import './header.css';

class Header extends Component {

  render() {
    return (
      <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
        <div className=''> 
          <Link to= '/'>
            <button className="btn btn-primary mx-1">Desplay</button>
          </Link>

        </div>
        <div className="flex-grow-1 text-center">
          <input type="text" placeholder="검색어를 입력" className="form-control w-50 h-50 mx-auto" />
        </div>
        <div>
          <Link to='/post'>
            <button className="btn btn-primary mx-1">글쓰기</button>
          </Link>
          <Link to='/mypage'>
            <button className="btn btn-primary mx-1">마이페이지</button>
          </Link>
        </div>
      </header>


    );
  }
}

export default Header;