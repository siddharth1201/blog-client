// Home.jsx
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../features/articles/articleSlice';
import { createComment, fetchComments } from '../features/comments/commentSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import ArticleComponent from './ArticleComponent';
import './css/home.css'; // CSS file for Home component

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error, hasMore } = useSelector((state) => state.articles);
  const { comments } = useSelector((state) => state.comments);
  const { token } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState('');
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);
  const [showCommentAddedPopup, setShowCommentAddedPopup] = useState(false);

  const gridRef = useRef(null);
  const observerRef = useRef();

  // Load initial articles
  useEffect(() => {
    dispatch(fetchArticles({ page: 1 })); // Fetch first batch of articles
  }, [dispatch]);

  // Fetch comments when an article is selected
  useEffect(() => {
    if (activeArticleSlug) {
      dispatch(fetchComments(activeArticleSlug));
    }
  }, [activeArticleSlug, dispatch]);

  // Handle scroll effect on articles
  useEffect(() => {
    const handleScroll = () => {
      const grid = gridRef.current;
      if (!grid) return;

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

  // Callback to load more articles when observer is triggered
  const loadMoreArticles = useCallback(() => {
    dispatch(fetchArticles({ page: articles.length / 10 + 1 })); // Adjust the page size as needed
  }, [dispatch, articles.length]);

  // IntersectionObserver to trigger loading more articles
  const lastArticleRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreArticles();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadMoreArticles, hasMore]
  );

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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="articles-grid" ref={gridRef}>
        {articles &&
          articles.map((article, index) => {
            const isLastArticle = index === articles.length - 1;
            return (
              <ArticleComponent
                key={article.id}
                article={article}
                onClick={handleViewPost}
                type={index % 5 === 0 ? 'banner' : 'regular'} // Adjust this condition to control banner placement
                ref={isLastArticle ? lastArticleRef : null} // Attach ref to the last article
              />
            );
          })}
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
