// CreatePost.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createArticle, updateArticle } from '../features/articles/articleSlice';
import CKEditorComponent from './CKEditorComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/createPost.css';

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the article to edit from the route state, if present
  const editingArticle = location.state?.article;

  // Initialize state with existing article data if available, otherwise empty
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(editingArticle?.subtitle || '');
  const [imageLink, setImageLink] = useState(editingArticle?.imageLink || '');
  const [body, setBody] = useState(editingArticle?.body || '');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Reset form when editingArticle changes (for better UX when switching from editing to creating)
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setSubtitle(editingArticle.subtitle);
      setImageLink(editingArticle.imageLink);
      setBody(editingArticle.body);
    } else {
      resetForm();
    }
  }, [editingArticle]);

  const handleCreateOrUpdateArticle = () => {
    if (editingArticle) {
      // Update existing article
      dispatch(updateArticle({ id: editingArticle.id, title, body, subtitle, imageLink }))
        .then(() => {
          setNotificationMessage('Article updated successfully!');
          setShowSuccessNotification(true);
          resetForm();
          setTimeout(() => setShowSuccessNotification(false), 3000);
          navigate('/');
        });
    } else {
      // Create new article
      dispatch(createArticle({ title, body, subtitle, imageLink }))
        .then(() => {
          setNotificationMessage('Article created successfully!');
          setShowSuccessNotification(true);
          resetForm();
          setTimeout(() => setShowSuccessNotification(false), 3000);
          navigate('/');
        });
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setImageLink('');
    setBody('');
  };

  return (
    <div className="create-post-container">
      <h2>{editingArticle ? 'Edit Article' : 'Create a New Article'}</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <input
        className="input-field"
        type="text"
        placeholder="Image Link"
        value={imageLink}
        onChange={(e) => setImageLink(e.target.value)}
      />
      <CKEditorComponent data={body} setData={setBody} />
      <button className="submit-button" onClick={handleCreateOrUpdateArticle}>
        {editingArticle ? 'Update' : 'Submit'}
      </button>
      <button className="cancel-button" onClick={() => navigate('/')}>
        Cancel
      </button>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
