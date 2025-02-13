import React, { Component, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './smallContent.css';

const serverIpAddress = 'http://221.139.98.118';

class SmallContent extends Component {
  state = {
    photos: []

  };

  componentDidMount() {
    // this.fetchImages();
    this.fetchImages2();
  }

  
  fetchImages2 = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios({
        method: 'GET',
        url: `${serverIpAddress}/api/image/show`,
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          imageId: 1
        }
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: response.headers['content-type']
        }));
        this.setState({ photos: [{ src: url }] });
        useCallback(url);
      }).catch(error => {
        console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
      });
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  render() {
    const { photos } = this.state;
    const {imageId} = this.props;
    return (
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <Link to={`/information/${1}`} boardId={1}>
              <img src={photo.src} alt={`Photo ${index + 1}`} />
            </Link>
            <p>{photo.caption}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default SmallContent;