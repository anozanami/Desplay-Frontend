import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input type="text" className="search-bar" placeholder="검색어 입력" />
        </header>
        <main className="App-main">
          <div className="recent-image-container">
            <div className="recent-image-slot">이미지 1</div>
            <div className="recent-image-slot">이미지 2</div>
            <div className="recent-image-slot">이미지 3</div>
            <div className="recent-image-slot">이미지 4</div>
            <div className="recent-image-slot">이미지 5</div>
            <div className="recent-image-slot">이미지 6</div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
