// viewPost.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchComments, createComment } from '../features/comments/commentSlice';
import { deleteArticle } from '../features/articles/articleSlice';
import './css/viewPost.css';

function ViewPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { article } = location.state;
  const { comments } = useSelector((state) => state.comments);
  const { token, user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState('');
  const [showCommentAddedPopup, setShowCommentAddedPopup] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    if (article.slug) {
      dispatch(fetchComments(article.slug));
    }
  }, [article.slug, dispatch]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    dispatch(createComment({ articleSlug: article.slug, body: newComment, token }))
      .then(() => {
        setNewComment('');
        setShowCommentAddedPopup(true);
        setTimeout(() => setShowCommentAddedPopup(false), 3000);
        dispatch(fetchComments(article.slug));
      })
      .catch((err) => {
        console.error('Failed to add comment:', err);
      });
  };

  const handleEditArticle = () => {
    navigate('/create', { state: { article } });
  };

  const handleDeleteArticle = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteArticle(article.id))
      .then(() => {
        setShowConfirmDeleteModal(false);
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to delete article:', err);
      });
  };

  // Check if the logged-in user is the author of the article
  const isAuthor = user && article.author.id === user.id;

  return (
    <div className="view-post-container">
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <h2>{article.title}</h2>
      <h3>{article.subtitle}</h3>
      <div dangerouslySetInnerHTML={{ __html: article.body }} />
      {article.imageLink && (
        <div className="article-image">
          <img src={article.imageLink} alt={article.title} />
        </div>
      )}

      {isAuthor && (
        <>
          <button className="edit-button" onClick={handleEditArticle}>
            Edit
          </button>
          <button className="delete-button" onClick={handleDeleteArticle}>
            Delete
          </button>
        </>
      )}

      <div className="comments-section">
        <h4>Comments</h4>
        {comments.map((comment) => (
          <p key={comment.id}>
            <strong>{comment.author.username}:</strong> {comment.body}
          </p>
        ))}
        <textarea
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="comment-button" onClick={handleAddComment}>
          Submit Comment
        </button>
      </div>

      {/* Comment Added Popup */}
      {showCommentAddedPopup && (
        <div className="popup">
          <p>Comment added!</p>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this article?</p>
            <button
              className="modal-confirm-button"
              onClick={handleConfirmDelete}
            >
              Yes
            </button>
            <button
              className="modal-cancel-button"
              onClick={() => setShowConfirmDeleteModal(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPost;
