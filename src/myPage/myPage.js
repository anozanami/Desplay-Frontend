import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { config } from '../config.js';

class myPage extends Component {
    state = {
        userId: sessionStorage.getItem("userId"),
        images: [],
        boardId: [],
        content: [],
    };

    componentDidMount() {
        console.log(this.state.userId);
        this.fetchUserInfo();
    }

    fetchUserInfo = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(config.api + '/api/board/search', {
                params: {
                    page: 0,
                    size: 100,
                    username: this.state.userId,
                    searchType: 'MY_LIKE' // 고정
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('fetchUserInfo res: ' + response.data.content);
            const boardId = [];
            const imageIds = [];
            if (response.status === 200) {
                for (let i = 0; i < response.data.content.length; i++) {
                    boardId.push(response.data.content[i].boardId);
                    if (response.data.content[i].images.length > 0) {
                        imageIds.push(response.data.content[i].images[0].imageId);
                    }
                }
                this.setState({ boardId: boardId, content: response.data.content });
                this.fetchImages(imageIds);
            } else {
                console.error('검색 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('검색 중 오류가 발생했습니다.', error);
        }
    };

    fetchImages = async (imageIds) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const photoPromises = imageIds.map(async (imageId) => {
                const response = await axios({
                    method: 'GET',
                    url: `${config.api}/api/image/show`,
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        imageId: imageId
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

            const images = await Promise.all(photoPromises);
            this.setState({ images: images.filter(photo => photo !== null) });
            sessionStorage.setItem('images', JSON.stringify(images.filter(photo => photo !== null)));
        } catch (error) {
            console.error('이미지를 불러오는 중 오류가 발생했습니다.', error);
        }
    };

    render() {
        const { userId, images, content, boardId } = this.state;

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

                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="p-3 bg-light border rounded">
                                <h4>{userId}</h4>
                                <nav className="nav flex-column">
                                    <a className="nav-link" href={`/mypage/${userId}`}>내가 쓴 글</a>
                                </nav>
                                <nav className="nav flex-column">
                                    <a className="nav-link" href={`/mypage/${userId}/like`}>좋아요 한 글</a>
                                </nav>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h2 className="mb-4">내가 쓴 글</h2>
                            {content.map((post, index) => (
                                <div key={post.boardId} className="mb-4">
                                    <h5>{post.title}</h5>
                                    {images[index] && (
                                        <Link to={`/information/${boardId[index]}`} state={{ post, content, index, photos: images }}>
                                            <img src={images[index].src} alt={`post ${post.boardId}`} className="img-fluid mb-2" />
                                        </Link>
                                    )}
                                    
                                </div>
                            ))}
                        </div>

                        <div className="col-md-3">
                            <div className="p-3 bg-light border rounded">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => this.fetchImages(this.state.boardId)}>업데이트</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default myPage;