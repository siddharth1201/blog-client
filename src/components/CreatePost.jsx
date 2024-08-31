import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createArticle, updateArticle } from '../features/articles/articleSlice';
import CKEditorComponent from './CKEditorComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import UpdateConfirmationModal from './modals/UpdateConfirmationModal';
import './css/createPost.css';
import { gsap } from 'gsap';

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const editingArticle = location.state?.article;

  const [title, setTitle] = useState(editingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(editingArticle?.subtitle || '');
  const [imageLink, setImageLink] = useState(editingArticle?.imageLink || '');
  const [body, setBody] = useState(editingArticle?.body || '');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [formErrors, setFormErrors] = useState({ title: '', body: '' });
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [showUpdateConfirmationModal, setShowUpdateConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setSubtitle(editingArticle.subtitle);
      setImageLink(editingArticle.imageLink);
      setBody(editingArticle.body);
      updateImagePreview(editingArticle.imageLink);
    } else {
      resetForm();
    }
  }, [editingArticle]);

  useEffect(() => {
    gsap.fromTo('.create-post-box', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' });
  }, []);

  const updateImagePreview = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setPreviewUrl(url);
      setImageError('');
    };
    img.onerror = () => {
      setPreviewUrl('');
      setImageError('Invalid image link');
    };
  };

  const handleImageLinkChange = (e) => {
    const link = e.target.value;
    setImageLink(link);
    updateImagePreview(link);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { title: '', body: '' };

    if (!title.trim()) {
      errors.title = 'Title cannot be empty or just whitespace';
      isValid = false;
    }

    if (!body.trim()) {
      errors.body = 'Body cannot be empty';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateOrUpdateArticle = () => {
    if (!validateForm()) return;

    setLoading(true);

    if (editingArticle) {
      setShowUpdateConfirmationModal(true);
    } else {
      dispatch(createArticle({ title, body, subtitle, imageLink }))
        .then(() => {
          setNotificationMessage('Article created successfully!');
          setShowSuccessNotification(true);
          resetForm();
          setTimeout(() => setShowSuccessNotification(false), 3000);
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
  };

  const handleUpdateConfirmation = () => {
    dispatch(updateArticle({ id: editingArticle.id, title, body, subtitle, imageLink }))
      .then(() => {
        setNotificationMessage('Article updated successfully!');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        navigate('/');
      })
      .finally(() => setLoading(false));
    setShowUpdateConfirmationModal(false);
  };

  const handleCancel = () => {
    if (editingArticle) {
      setShowCancelConfirmationModal(true);
    } else {
      navigate('/');
    }
  };

  const confirmNavigation = () => {
    setShowCancelConfirmationModal(false);
    navigate('/');
  };

  const cancelNavigation = () => {
    setShowCancelConfirmationModal(false);
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setImageLink('');
    setBody('');
    setPreviewUrl('');
    setImageError('');
    setFormErrors({ title: '', body: '' });
  };

  return (
    <div className="create-post-container">
      <div className="create-post-box">
        <h2 className="create-post-title">
          {editingArticle ? 'Edit Article' : 'Create a New Article'}
        </h2>
        <div className="create-post-form">
          <div className="input-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && <p className="form-error">{formErrors.title}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="subtitle">Subtitle</label>
            <input
              id="subtitle"
              type="text"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="imageLink">Image Link</label>
            <input
              id="imageLink"
              type="text"
              placeholder="Image Link"
              value={imageLink}
              onChange={handleImageLinkChange}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            {imageError && <p className="image-error">{imageError}</p>}
          </div>
          <CKEditorComponent data={body} setData={setBody} />
          {formErrors.body && <p className="form-error">{formErrors.body}</p>}
          <div className="button-group">
            <button className="submit-button" onClick={handleCreateOrUpdateArticle}>
              {editingArticle ? 'Update' : 'Submit'}
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
          )}

          {showSuccessNotification && (
            <div className="notification">
              <p>{notificationMessage}</p>
            </div>
          )}

          {showCancelConfirmationModal && (
            <UpdateConfirmationModal
              actionType="save"
              onConfirm={confirmNavigation}
              onCancel={() => navigate('/')}
            />
          )}

          {showUpdateConfirmationModal && (
            <UpdateConfirmationModal
              actionType="update"
              onConfirm={handleUpdateConfirmation}
              onCancel={() => setShowUpdateConfirmationModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

       
