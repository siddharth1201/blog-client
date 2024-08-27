import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, createArticle } from '../features/articles/articleSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import CKEditorComponent from './CKEditorComponent';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.articles);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [body, setBody] = useState(''); // CKEditor will modify this state

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateArticle = () => {
    dispatch(createArticle({ title, body, subtitle, imageLink }));
    setTitle('');
    setSubtitle('');
    setImageLink('');
    setBody('');
  };

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create a New Article</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image Link"
        value={imageLink}
        onChange={(e) => setImageLink(e.target.value)}
      />

      {/* CKEditor component */}
      <CKEditorComponent data={body} setData={setBody} />
      
      <button onClick={handleCreateArticle}>Submit</button>

      <h2>Articles</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {articles && articles.map((article) => (
        <div key={article.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{article.title}</h3>
          {article.subtitle && <h4>{article.subtitle}</h4>}
          
          {/* Render the body content as HTML */}
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
          
          {article.imageLink && (
            <div>
              <img src={article.imageLink} alt={article.title} style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
