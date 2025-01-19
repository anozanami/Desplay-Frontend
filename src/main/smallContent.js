import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './smallContent.css';

class SmallContent extends Component {
  state = {
    photos: []
  };

  componentDidMount() {
    this.fetchImages();
    // this.test();
    // this.test2();
    // this.fetchImages2();
  }

  test = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.postForm('http://43.201.215.174/test/member/user', {
        json: {

        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(response);
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  fetchImages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://43.201.215.174/api/image/show', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          imageId: 101
        }
      });

      if (response.status === 200) {
        const photos = response.data.slice(0, 7);
        this.setState({ photos });
      } else {
        console.error('이미지를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다람쥐.', error);
    }
  };

  fetchImages2 = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://43.201.215.174/api/image/show?imageId=1', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        json: {
          imageId: 1
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        const photos = data.slice(0, 7);
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
            <Link to={`/information/${photo.id}`}>
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