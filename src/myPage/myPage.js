import React, { Component } from 'react';
import Content from './content.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {config} from '../config.js';

class myPage extends Component {
    state = {
        userId: sessionStorage.getItem("userId"),
        images: []
    };

    componentDidMount() {
        this.fetchUserImages();
    }

    fetchUserImages = async () => {
        try {
            const response = await axios.get(`${config.api}/api/image/show`, {
                json: { 
                    userId: this.state.userId
                }
            });

            if (response.status === 200) {
                this.setState({ images: response.data });
            } else {
                console.error('이미지를 불러오는 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
        }
    };

    render() {
        const { userId, images } = this.state;

        return (
            <div className="myPage">
                {/* header */}
                <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
                    <div className=''>
                        <Link to='/'>
                            <button className="btn btn-primary mx-1">Desplay</button>
                        </Link>
                    </div>
                    <div>
                        <Link to='/post'>
                            <button className="btn btn-primary mx-1">글쓰기</button>
                        </Link>
                        <Link to={`/mypage/${userId}`}>
                            <button className="btn btn-primary mx-1">마이페이지</button>
                        </Link>
                    </div>
                </header>
                {/* header */}

                <Content />
                <div className="image-gallery">
                    {images.map((image, index) => (
                        <img key={index} src={image.url} alt={`User post ${index}`} className="img-thumbnail" />
                    ))}
                </div>
            </div>
        );
    }
}

export default myPage;