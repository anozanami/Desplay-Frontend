import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './post.css';
import { config } from '../config.js';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      title: '',
      content: '',
      tags: [],
      items: [],
      currentItem: {
        name: '',
        link: ''
      },
      currentFile : null,
      images: []
    }
  }

  onFileChange = (event) => {
    const file = event.target.files[0];
    console.log('파일:', file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        this.setState((prevState) => ({
          selectedImage: newImage,
          // images: [...prevState.images, file]
          currentFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  onTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  onContentChange = (event) => {
    this.setState({ content: event.target.value });
  };

  onTagChange = (event) => {
    this.setState({ tags: event.target.value.split(',') });
  };

  onNameChange = (event) => {
    this.setState({ currentItem: { ...this.state.currentItem, name: event.target.value } });
  };

  onLinkChange = (event) => {
    this.setState({ currentItem: { ...this.state.currentItem, link: event.target.value } });
  };

  addItem = (event) => {
    
    this.setState((prevState) => ({
      items: [...prevState.items, { first: prevState.currentItem.name, second: prevState.currentItem.link }],
      images: [...prevState.images, prevState.currentFile],
      currentItem: { name: '', link: '' },
      selectedImage: null
    }));
  };

  onSubmit = async (e) => {
    // e.preventDefault();
    const { images, title, content, tags, items } = this.state
    console.log('이미지 리스트:', images);
    const formData = new FormData();

    const data = {
      title: title,
      content: content,
      tags: tags,
      items: items
    };

    console.log('게시글 작성 데이터:', data);

    formData.append('boardWriteRequest', new Blob([JSON.stringify(data)], {
      type: "application/json"
    }));

    images.forEach((image) => {
      formData.append("files", image);
    });

    try {
      const response = await axios.post(`${config.api}/api/board/write`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

      console.log('게시글 작성 응답:', response.data);
      alert('게시글이 작성되었습니다.');
      this.setState({
        selectedImage: null,
        title: '',
        content: '',
        tags: [],
        items: [],
        currentItem: {
          name: '',
          link: ''
        },
        images: []
      });
    } catch (error) {
      console.error('게시글 작성 중 오류가 발생했습니다.', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };


  render() {
    const { selectedImage, title, content, tags, items, currentItem, images } = this.state;
    return (
      <div className="post">
        {/* header */}
        <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
          <div className=''>
            <Link to='/'>
              <button className="btn btn-primary mx-1">Desplay</button>
            </Link>
          </div>
          <div className="flex-grow-1 text-center">
          </div>
          <div>
            <Link to='/mypage'>
              <button className="btn btn-primary mx-1">마이페이지</button>
            </Link>
          </div>
        </header>
        {/* header */}

        {/* form container */}
        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="upload-section border p-5 text-center mx-2" style={{ width: '1000px', height: '500px' }}>
              <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  {!selectedImage && <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.onFileChange}
                    style={{ display: 'block', margin: '0 auto' }}
                  />}
                  {selectedImage && (
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10px' }} />
                  )}

                </div>
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={this.onTitleChange}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={this.onContentChange}
                    style={{ width: '100%', height: '100px' }}
                  />
                  <input
                    type="text"
                    placeholder="태그를 입력하세요 (쉼표로 구분)"
                    value={tags.join(',')}
                    onChange={this.onTagChange}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                  <input
                    type="text"
                    placeholder="상품 이름을 입력하세요"
                    value={currentItem.name}
                    onChange={this.onNameChange}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                  <input
                    type="text"
                    placeholder="상품 링크를 입력하세요"
                    value={currentItem.link}
                    onChange={this.onLinkChange}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                  <button type="button" onClick={this.addItem} className="btn btn-secondary mt-3">상품 추가</button>
                  <button type="button" onClick={this.onSubmit} className="btn btn-primary mt-3">게시글 작성</button>
                </div>
              </form>
            </div>
          </div>
          <div className="image-preview">
            {images.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
            ))}
          </div>
        </div>
        {/* form container */}
      </div>
    );
  }
}

export default Post;
