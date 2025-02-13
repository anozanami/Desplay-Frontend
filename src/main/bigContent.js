import React, { Component } from 'react';
import axios from 'axios';
import './bigContent.css';
import { Link } from 'react-router-dom';
import {config} from '../config.js';

class BigContent extends Component {
  state = {
    photos: [],
    boardId: this.props.boardId
  };

  componentDidMount() {
    this.fetchImages(this.state.boardId);
  }

  fetchImages = async (boardIds) => {
    try {
      const token = localStorage.getItem('accessToken');
      const photoPromises = boardIds.map(async (boardId) => {
        const response = await axios({
          method: 'GET',
          url: `${config.api}/api/image/show`,
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            imageId: boardId
          }
        });

        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data], {
            type: response.headers['content-type']
          }));
          return { src: url };
        } else {
          console.error('이미지를 불러오는 중 오류가 발생했습니다.');
          return null;
        }
      });

      const photos = await Promise.all(photoPromises);
      this.setState({ photos: photos.filter(photo => photo !== null) });
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  render() {
    const { photos, boardId } = this.state;

    return (
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <Link to={`/information/${boardId[index]}`} state={{ photos, index }}>
              <img src={photo.src} alt={`Photo ${index + 1}`} />
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default BigContent;
