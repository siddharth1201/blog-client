// Home.jsx
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../features/articles/articleSlice';
import { createComment, fetchComments } from '../features/comments/commentSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ArticleComponent from './ArticleComponent';
import './css/home.css'; // CSS file for Home component

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const { comments } = useSelector((state) => state.comments);
  const { token } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState('');
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);
  const [showCommentAddedPopup, setShowCommentAddedPopup] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  useEffect(() => {
    if (activeArticleSlug) {
      dispatch(fetchComments(activeArticleSlug));
    }
  }, [activeArticleSlug, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const grid = gridRef.current;
      const articles = Array.from(grid.querySelectorAll('.article-component'));
      const center = window.innerHeight / 2;

      articles.forEach((article) => {
        const rect = article.getBoundingClientRect();
        const distance = Math.abs(center - (rect.top + rect.height / 2));
        const scale = Math.max(1 - distance / 1000, 0.8);
        article.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

 


  const handleViewPost = (article) => {
    navigate(`/view/${article.slug}`, { state: { article } });
  };

  const handleAddComment = (articleSlug) => {
    if (!newComment.trim()) return;

    dispatch(createComment({ articleSlug, body: newComment, token }))
      .then(() => {
        setNewComment('');
        setShowCommentAddedPopup(true);
        setTimeout(() => setShowCommentAddedPopup(false), 3000);
        dispatch(fetchComments(articleSlug));
      })
      .catch((err) => {
        console.error('Failed to add comment:', err);
      });
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Home Page!</h1>
      

      <h2>Articles</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="articles-grid" ref={gridRef}>
        {articles &&
          articles.map((article, index) => (
            <ArticleComponent
              key={article.id}
              article={article}
              onClick={handleViewPost}
              type={index % 5 === 0 ? 'banner' : 'regular'} // Adjust this condition to control banner placement
            />
          ))}
      </div>

      {/* Comment Added Popup */}
      {showCommentAddedPopup && (
        <div className="popup">
          <p>Comment added!</p>
        </div>
      )}

      
    </div>
  );
}

export default Home;
