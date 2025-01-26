import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios, { formToJSON } from 'axios';
import './post.css';

class Post extends Component {
  state = {
    selectedImage: null,
    title: '',
    content: '',
    tags: [],
    items: [('name', 'link')],
    currentItem: {
      name: '',
      link: ''
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

  addItem = () => {
    this.setState((prevState) => ({
      items: [...prevState.currentItem.name, prevState.currentItem.link],
      currentItem: { name: '', link: '' }
    }));
    console.log(this.state.items);
  };

  onSubmit = async () => {
    const { selectedImage, title, content, tags, items } = this.state
    const formData = new FormData();

    const data = {
      title: title,
      content: content,
      tags: tags,
      items: items.map(item => ({
        first: 'name',
        second: 'link',
      }))
    };

    // console.log('게시글 작성 데이터:', data); 
    // console.log('제이슨 데이터:', JSON.stringify(data));
    // console.log('이미지 데이터:', selectedImage);
    formData.append('boardWriteRequest', JSON.stringify(data));
    formData.append('files', selectedImage);

    console.log('폼 데이터:', formData);  

    
    try {
      const response = await axios.post('http://43.201.215.174/api/board/write', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status === 200) {
        console.log('게시글 작성 성공:', response.data);
      } else {
        console.error('게시글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 중 오류가 발생했습니다.', error);
    }
  };



  render() {
    const { selectedImage, title, content, tags, items, currentItem } = this.state;

    return (

      <div className="">
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
        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="upload-section border p-5 text-center mx-2" style={{ width: '1000px', height: '500px' }}>
              <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.onFileChange}
                    style={{ display: 'block', margin: '0 auto' }}
                  />
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
                  <div>
                    <input
                      type="text"
                      placeholder="상품 이름을 입력하세요 "
                      value={currentItem.name}
                      onChange={this.onNameChange}
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                    <input
                      type='link'
                      placeholder='상품 링크를 입력하세요'
                      value={currentItem.link}
                      onChange={this.onLinkChange}
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                  </div>
                </div>
              </form>
              <button type="button" onClick={this.addItem} className="btn btn-secondary mt-3">상품 추가</button>
              <button type="button" onClick={this.onSubmit} className="btn btn-primary mt-3">게시글 작성</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
