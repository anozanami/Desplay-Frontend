import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './information.css';
import Header from './header.js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const token = sessionStorage.getItem('accessToken');
const username = sessionStorage.getItem('username');

const Information = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, boardId, response, photos, content, index } = location.state || {};
  const newContent = content[index];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log('boardId in information: ' + boardId);
    console.log('query in information: ' + searchQuery);
    console.log('response in information: ' + content);
  }, [boardId, searchQuery]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % content.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + content.images.length) % content.images.length);
  };

  const pushLike = async () => {
    try {
      const response = await axios.post(`${config.api}/api/scrap/push`, {
        boardId: boardId,
        username: username,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('좋아요 버튼 누르기 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center">{newContent.title}</h1>
        <div className="main-image-container text-center">
          <img src={photos[index].src} alt="Gallery" className="img-fluid" />
        </div>
        <div className="tags text-center" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '20px' }}>
          {newContent.tags.map((tag, index) => (
            <span key={index} className="badge bg-secondary mx-1">#{tag.title}</span>
          ))}
          <button 
          className="btn btn-primary" 
          onClick={pushLike}>좋아요</button>
        </div>
        <div className="row mt-4">
          <button onClick={prevImage} className="btn btn-secondary col-1">←</button>
          <div className="col-10 d-flex justify-content-around">
            {newContent.items.map((item, index) => (
              <div key={index} className={`card ${index === currentImageIndex ? 'border-primary' : ''}`} style={{ width: '18rem' }}>
                {/* <img src={item.link} className="card-img-top" alt={`Thumbnail ${index + 1}`} /> */}
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">상품 링크</a>
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextImage} className="btn btn-secondary col-1">→</button>
        </div>
        
      </div>
    </div>
  );
};

export default Information;
