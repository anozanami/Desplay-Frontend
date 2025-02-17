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
        first: '',
        second: ''
      },
      currentFile: null,
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
    this.setState({ currentItem: { ...this.state.currentItem, first: event.target.value } });
    // first = name
  };

  onLinkChange = (event) => {
    this.setState({ currentItem: { ...this.state.currentItem, second: event.target.value } });
    // second = link
  };

  addImage = (event) => {
    this.setState((prevState) => ({
      images: [...prevState.images, prevState.currentFile],
      selectedImage: null
    }));
  };

  addItem = (event) => {
    this.setState((prevState) => ({
      items: [...prevState.items, { first: prevState.currentItem.first, second: prevState.currentItem.second }],
      currentItem: { first: ' ', second: ' ' },
    }));
  };

  onSubmit = async (e) => {
    const { images, title, content, tags, items } = this.state
    console.log('이미지 리스트:', images);
    const formData = new FormData();

    const data = {
      title: title,
      content: content,
      tags: tags,
      items: items
    };    

    formData.append('boardWriteRequest', new Blob([JSON.stringify(data)], {
      type: "application/json"
    }));

    images.forEach((image) => {
      formData.append("files", image);
    });

    console.log('data: ', data);

    for (let key of formData.keys()) {
      console.log('key:', key);
    }

    for (let value of formData.values()) {
      console.log('value:', value);
    }

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
          first: '',
          second: ''
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
            {/* <Link to='/myPage/'>
              <button className="btn btn-primary mx-1">마이페이지</button>
            </Link> */}
          </div>
        </header>
        {/* header */}

        {/* form container */}
        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="items-section border p-5 text-center mx-2" style={{ width: '300px', height: '500px', overflowY: 'auto' }}>
              <h5>추가된 상품</h5>
              <ul className="list-group">
                {items.map((item, index) => (
                  <li key={index} className="list-group-item">
                    <a href={item.second} target="_blank" rel="noopener noreferrer">{item.first}</a>
                  </li>
                ))}
              </ul>
            </div>
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
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%', marginTop: '10px' }} />
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
                    value={currentItem.first}
                    onChange={this.onNameChange}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                  <input
                    type="text"
                    placeholder="상품 링크를 입력하세요"
                    value={currentItem.second}
                    onChange={this.onLinkChange}
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                  <button type="button" onClick={this.addImage} className="btn btn-secondary mt-3">사진 추가</button>
                  <button type="button" onClick={this.addItem} className="btn btn-secondary mt-3" style={{ marginLeft: '10px' }}>상품 추가</button>
                  <button type="button" onClick={this.onSubmit} className="btn btn-primary mt-3" style={{ display: 'block', marginTop: '10px', marginLeft: '160px' }}>게시글 작성</button>
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
