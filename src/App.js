import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BigContent from './main/bigContent';
import SmallContent from './main/smallContent';
import Post from './post/post';
import MyPage from './myPage/myPage';
import Login from './main/login';
import Register from './main/register';

const serverIpAddress = "http://221.139.98.118";
let BoardId = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: sessionStorage.getItem('userId'),
      searchQuery: '',
      searchResults: [],
      autoCompleteSuggestions: [],
      accessToken: sessionStorage.getItem('accessToken'),
      selectedBoardId: null,
      boardId: null
    };
  }

  handleLogin = (userId, accessToken, refreshToken) => {
    this.setState({ loggedIn: true, userId, accessToken, refreshToken });
  };

  handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('userId');
    this.setState({ loggedIn: false, userId: null, accessToken: null });
  };

  handleInputChange = async (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });

    if (searchQuery.length > 0) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios({
          method: 'GET',
          url: `${serverIpAddress}/api/auto-complete/get-string/${searchQuery}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('searchQuery : ', searchQuery);
        if (response.status === 200) {
          console.log('자동완성 응답 데이터:', response.data.list);
          this.setState({ autoCompleteSuggestions: response.data.list.slice(0, 6) });
        } else {
          console.error('자동완성 오류1');
        }
      } catch (error) {
        console.error('자동완성 오류2', error);
      }
    } else {
      this.setState({ autoCompleteSuggestions: [] });
    }
  };

  handleAutoCompleteSelect = async (suggestion) => {
    const token = localStorage.getItem('accessToken');
    this.setState({ searchQuery: suggestion, autoCompleteSuggestions: [] });

    try {
      await axios.post(serverIpAddress + '/api/auto-complete/update-string', {
        json: {
          input: suggestion
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('자동완성 문자열을 업데이트하는 중 오류가 발생했습니다.', error);
    }
  };

  handleSearch = async () => {
    const token = localStorage.getItem('accessToken');
    const { searchQuery } = this.state;
    try {
      const response = await axios.get(serverIpAddress + '/api/board/search', {
        params: {
          page: 0,
          size: 100,
          keyword: searchQuery, // 고정
          // tags: 'NEAT&FANCY',
          // username: this.state.userId, 마이페이지에서만 필요
          // sortType: 'DATE_DESC&LIKE_ASC', 
          searchType: 'MAIN' // 고정
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const boardId = [];
        for (let i = 0; i < response.data.content.length; i++) {
          boardId.push(response.data.content[i].boardId);
        }
        this.setState({ selectedBoardId: boardId, searchResults: response.data.content });
        console.log('BoardId : ', boardId);
        // URL을 검색 쿼리와 함께 변경
        sessionStorage.setItem('boardId', boardId);
        this.props.navigate(`/?query=${searchQuery}`);
      } else {
        console.error('검색 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 중 오류가 발생했습니다.', error);
    }
  };

  handleHomeClick = () => {
    window.location.href = '/';
  };

  render() {
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const userId = sessionStorage.getItem('userId');
    const { searchQuery, autoCompleteSuggestions, selectedBoardId } = this.state;
    return (

        <div className="App">
          <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
            <div className="left-section">
              <button className="btn btn-primary mx-1" onClick={this.handleHomeClick}>Desplay</button>
            </div>

            {/* 검색창 */}
            <div className="search-section flex-grow-1 text-center d-flex justify-content-center">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="form-control w-50 h-50"
                value={this.state.searchQuery}
                onChange={this.handleInputChange}
              />
              <button 
                className="btn btn-primary mx-1" 
                onClick={this.handleSearch}
              >검색</button>

              {autoCompleteSuggestions.length > 0 && (
                <ul className="list-group">
                  {autoCompleteSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      onClick={() => this.handleAutoCompleteSelect(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* 검색창 */}

            <div className="right-section">
              {loggedIn ? (
                <div>
                  <span className="mx-2">환영합니다, {userId}님</span>
                  <Link to={`/post`} userId={userId}>
                    <button className="btn btn-primary mx-1">글쓰기</button>
                  </Link>
                  <Link to={`/mypage/${userId}`} userId={userId}>
                    <button className="btn btn-primary mx-1">마이페이지</button>
                  </Link>
                  <button className="btn btn-danger mx-1" onClick={this.handleLogout}>로그아웃</button>
                </div>
              ) : (
                <div>
                  <Link to="/login">
                    <button className="btn btn-primary mx-1">로그인</button>
                  </Link>
                  <Link to="/register">
                    <button className="btn btn-secondary mx-1">회원가입</button>
                  </Link>
                </div>
              )}
            </div>
            {/* <div className="search-results">
              {this.state.searchResults.map((result, index) => (
                <div key={index} className="search-result-item">
                  <Link to={`/board/${result.id}`}>
                    <img src={result.imageUrl} alt={result.title} className="search-result-image" />
                    <div>{result.title}</div>
                  </Link>
                </div>
              ))}
            </div> */}
            
          </header>
          {selectedBoardId && <BigContent boardId={selectedBoardId} />}
          {/* {selectedBoardId && <SmallContent boardId={selectedBoardId} />} */}
          <Routes>
            <Route path="/post" element={<Post />} />
            <Route path="/mypage/:userId" element={<MyPage />} />
            <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

    );
  }
}

// App 컴포넌트를 함수형 컴포넌트로 감싸서 navigate를 props로 전달
const AppWithNavigate = (props) => {
  const navigate = useNavigate();
  return <App {...props} navigate={navigate} />;
};

export default AppWithNavigate;
