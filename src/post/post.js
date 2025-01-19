import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './post.css';

class Post extends Component {
  state = {
    images: [],
    selectedImage: null
  };

  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = async () => {
    try {
      const response = await axios.get('http://43.201.215.174/api/image/show');
      if (response.status === 200) {
        this.setState({ images: response.data });
      } else {
        console.error('이미지를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ selectedImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  render() {
    const { images, selectedImage } = this.state;

    return (
      <div className="container">
        <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
          <div className=''>
            <Link to='/'>
              <button className="btn btn-primary mx-1">Desplay</button>
            </Link>
          </div>
          <div className="flex-grow-1 text-center">
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

        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="upload-section border p-5 text-center mx-2" style={{ width: '500px', height: '500px' }}>
              <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={this.onFileChange}
                  style={{ display: 'block', margin: '0 auto' }}
                />
                {selectedImage && (
                  <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center align-items-center">
            <button className="btn btn-secondary mx-2">←</button>
            <div className="d-flex">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail mx-2`}
                  style={{ width: '150px', cursor: 'pointer' }}
                />
              ))}
            </div>
            <button className="btn btn-secondary mx-2">→</button>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <button className="btn btn-primary">글쓰기</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
