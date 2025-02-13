import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일을 임포트합니다.
const posts = [
    { id: 1, content: '첫 번째 글 내용입니다.', image: 'image1.jpg' },
    { id: 2, content: '두 번째 글 내용입니다.', image: 'image2.jpg' },
];

const imageUrl = 'https://s3-alpha-sig.figma.com/img/795f/8508/0bdddcfda6d947d68b217e8a97120729?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=md1E~PIYtZ~3gomvaEBYTfQgPknZPkaEAKpdBtiEBd2YFVoAXMWu6War-Z0S~lBJFGsN6ZQf5oczjcYFa9e~e~a~md4HfE5Jz9HQBSsUfNB4wrodsJW~b0UkvGu3u73y-8--HzVYcAQLh9TKA4obXDD8Whea~dtn5KGzRqfyC7Xx0nIKjI5cyeHdsmKg6ji7JSHw~ZOJ954IUtpU7z4wyj9dscB5NeuheiNtZBdSXUDybI4EajiPYEnzk5GoyJqI-7T4BWMgSHYEhhVowvxV3ZUKHPZCPdGISxa-Klp-r7q1CRFq~tVytQbJIh2RuZn4aPEWZ~qSfTOSybOgYsOd7w__';


class content extends Component {


    render() {
        const userId = sessionStorage.getItem('userId');
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <div className="p-3 bg-light border rounded">
                            <h4>{userId}</h4>
                            <nav className="nav flex-column">
                                <a className="nav-link" href={`/mypage/${userId}`}>내가 쓴 글</a>
                            </nav>
                            <nav className="nav flex-column">
                                <a className="nav-link" href={`/mypage/${userId}`}>내가 쓴 글</a>
                            </nav>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h2 className="mb-4">내가 쓴 글</h2>
                        {posts.map(post => (
                            <div key={post.id} className="mb-4">
                                <img src={imageUrl} alt={`post ${post.id}`} className="img-fluid mb-2" />
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-3">
                        <div className="p-3 bg-light border rounded">
                            <h5>추가 정보</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default content;