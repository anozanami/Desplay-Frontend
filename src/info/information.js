import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './information.css';
import Header from './header.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const imageUrl = 'https://s3-alpha-sig.figma.com/img/795f/8508/0bdddcfda6d947d68b217e8a97120729?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=md1E~PIYtZ~3gomvaEBYTfQgPknZPkaEAKpdBtiEBd2YFVoAXMWu6War-Z0S~lBJFGsN6ZQf5oczjcYFa9e~e~a~md4HfE5Jz9HQBSsUfNB4wrodsJW~b0UkvGu3u73y-8--HzVYcAQLh9TKA4obXDD8Whea~dtn5KGzRqfyC7Xx0nIKjI5cyeHdsmKg6ji7JSHw~ZOJ954IUtpU7z4wyj9dscB5NeuheiNtZBdSXUDybI4EajiPYEnzk5GoyJqI-7T4BWMgSHYEhhVowvxV3ZUKHPZCPdGISxa-Klp-r7q1CRFq~tVytQbJIh2RuZn4aPEWZ~qSfTOSybOgYsOd7w__';
const token = localStorage.getItem('accessToken');
const username = localStorage.getItem('username');
const images = [
  {
    src: { imageUrl },
    productName: '제품명1',
    discountRate: '할인율1',
    price: '가격1',
  },
  {
    src: { imageUrl },
    productName: '제품명2',
    discountRate: '할인율2',
    price: '가격2',
  },
  {
    src: { imageUrl },
    productName: '제품명3',
    discountRate: '할인율3',
    price: '가격3',
  },
  // 필요한 만큼 이미지와 정보를 추가합니다.
];

class Information extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: 0,
      // isLiked: false
    };
  }

  nextImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % images.length,
    }));
  };

  prevImage = () => {
    this.setState((prevState) => ({
      currentImageIndex: (prevState.currentImageIndex - 1 + images.length) % images.length,
    }));
  };

  pushLike = async () => {
    if (!this.state.isLiked) {
      try {
        const response = await axios.post(`${config.api}/api/scrap/push`, {
          boardId: 1,
          username: username,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log(response.data);
        this.setState({ isLiked: true });
      } catch (error) {
        console.error('좋아요 버튼 누르기 중 오류가 발생했습니다.', error);
      }
    } else {
      try {
        const response = await axios.post(`${config.api}/api/scrap/undo`, {
          boardId: 1,
          username: username,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log(response.data);
        this.setState({ isLiked: false });
      } catch (error) {
        console.error('좋아요 취소 중 오류가 발생했습니다.', error);
      }
    }
  };

  pushLike2 = async () => {
    try {
      const response = await axios.post(`${config.api}/api/scrap/push`, {
        boardId: 1,
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

  render() {

    const { currentImageIndex } = this.state;
    // const { id } = useParams();
    // const image = images.find((img) => img.id === parseInt(id));
    return (
      <div>
        <Header></Header>
        <div className="container mt-5">
          <h1 className="text-center">제목</h1>
          <div className="main-image-container text-center">
            {/* <img src={images[currentImageIndex].src} alt="Gallery" className="img-fluid" /> */}
            <img src={imageUrl} alt="Gallery" className="img-fluid" />

          </div>
          <div className="tags text-center">
            <p>#태그1 #태그2</p>
          </div>
          <div className="row mt-4">
            <button onClick={this.prevImage} className="btn btn-secondary col-1">←</button>
            <div className="col-10 d-flex justify-content-around">
              {images.map((image, index) => (
                <div key={index} className={`card ${index === currentImageIndex ? 'border-primary' : ''}`} style={{ width: '18rem' }}>
                  <img src={imageUrl} className="card-img-top" alt={`Thumbnail ${index + 1}`} />
                  <div className="card-body">
                    <h5 className="card-title">{image.productName}</h5>
                    <p className="card-text">할인율: {image.discountRate}</p>
                    <p className="card-text">가격: {image.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={this.nextImage} className="btn btn-secondary col-1">→</button>
          </div>
          <button className="btn btn-primary mt-4" onClick={this.pushLike2}>좋아요</button>
        </div>
      </div>
    );
  }
}

export default Information;
