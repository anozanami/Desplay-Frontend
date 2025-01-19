import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './bigContent.css'; // CSS 파일을 임포트합니다.

class bigContent extends Component {
  state = {
    photos: []
  };

  // componentDidMount() {
  //   this.fetchImages();
  // }

  fetchImages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://43.201.215.174/api/image/show', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const photos = response.data.slice(0, 4);
        this.setState({ photos });
      } else {
        console.error('이미지를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  render() {
    const { photos } = this.state;

    return (
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo.src} alt={`Photo ${index + 1}`} />
            <p>{photo.caption}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default bigContent;
