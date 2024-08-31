// Home.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { fetchArticles } from '../features/articles/articleSlice';
import { createComment, fetchComments } from '../features/comments/commentSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/home.css';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const { comments } = useSelector((state) => state.comments);
  const { token } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState('');
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);
  const [showCommentAddedPopup, setShowCommentAddedPopup] = useState(false);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  useEffect(() => {
    if (activeArticleSlug) {
      dispatch(fetchComments(activeArticleSlug));
    }
  }, [activeArticleSlug, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreatePost = () => {
    navigate('/create');
  };

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
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <button className="create-post-button" onClick={handleCreatePost}>
        Create Post
      </button>

      <h2>Articles</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {articles &&
        articles.map((article) => (
          <div
            className="article-card"
            key={article.id}
            onClick={() => handleViewPost(article)}
          >
            <h3>{article.title}</h3>
            {article.subtitle && <h4>{article.subtitle}</h4>}
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            {article.imageLink && (
              <div className="article-image">
                <img src={article.imageLink} alt={article.title} />
              </div>
            )}
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPost(article);
              }}
            >
              View Post
            </button>

            {/* Comments Section */}
            <div className="comments-section">
              <h4>Comments</h4>
              {comments
                .filter((comment) => comment.articleSlug === article.slug)
                .slice(-2)
                .map((comment) => (
                  <p key={comment.id}>
                    <strong>{comment.author.username}:</strong> {comment.body}
                  </p>
                ))}
              <textarea
                className="comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="comment-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddComment(article.slug);
                }}
              >
                Submit Comment
              </button>
            </div>
          </div>
        ))}

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
