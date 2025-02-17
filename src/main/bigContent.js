import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bigContent.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { config } from '../config.js';

const BigContent = ({ boardId, content, searchQuery }) => {
  const [photos, setPhotos] = useState(JSON.parse(sessionStorage.getItem('photos')) || []);
  const selectedBoardId = JSON.parse(sessionStorage.getItem('selectedBoardId')) || [];
  useEffect(() => {
    if (photos.length === 0) {
      fetchImages(boardId);
    }
    console.log('content in bigContent: ' + content);
  }, [boardId, photos.length, searchQuery]);

  const fetchImages = async (boardIds) => {
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
      setPhotos(photos.filter(photo => photo !== null));
      sessionStorage.setItem('photos', JSON.stringify(photos.filter(photo => photo !== null)));
      console.log('photos in bigContent: ' + photos);
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <div className="big-contents">
      {photos.map((photo, index) => (
        <div key={index} className="big-contents-item">
          <Link to={`/information/${boardId[index]}`} state={{ searchQuery: searchQuery, content: content, photos: photos, index: index, boardId: boardId[index] }}>
            <img src={photo.src} alt={`Photo ${index + 1}`} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BigContent;
