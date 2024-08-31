import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createArticle, updateArticle } from '../features/articles/articleSlice';
import CKEditorComponent from './CKEditorComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import UpdateConfirmationModal from './modals/UpdateConfirmationModal';
import './css/createPost.css';

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
  const [previewUrl, setPreviewUrl] = useState(''); // For image preview
  const [imageError, setImageError] = useState(''); // For image link validation
  const [formErrors, setFormErrors] = useState({ title: '', body: '' }); // For form validation errors
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false); // For cancel confirmation modal
  const [showUpdateConfirmationModal, setShowUpdateConfirmationModal] = useState(false); // For update confirmation modal

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

  const updateImagePreview = (url) => {
    // Check if the URL is valid and an image
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
        });
    }
  };

  const handleUpdateConfirmation = () => {
    dispatch(updateArticle({ id: editingArticle.id, title, body, subtitle, imageLink }))
      .then(() => {
        setNotificationMessage('Article updated successfully!');
        setShowSuccessNotification(true);
        resetForm();
        setTimeout(() => setShowSuccessNotification(false), 3000);
        navigate('/');
      });
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
    navigate('/'); // Redirect to the view page
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
    setFormErrors({ title: '', body: '' }); // Reset form errors
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
      {formErrors.title && <p className="form-error">{formErrors.title}</p>}
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
        onChange={handleImageLinkChange}
      />
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
      {imageError && <p className="image-error">{imageError}</p>}
      <CKEditorComponent data={body} setData={setBody} />
      {formErrors.body && <p className="form-error">{formErrors.body}</p>}
      <button className="submit-button" onClick={handleCreateOrUpdateArticle}>
        {editingArticle ? 'Update' : 'Submit'}
      </button>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel
      </button>

      {showSuccessNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
        </div>
      )}

      {showCancelConfirmationModal && (
        <UpdateConfirmationModal
          actionType="save"
          onConfirm={confirmNavigation}
          onCancel={() => navigate('/')} // Redirect to the view page on discard
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
  );
}

export default CreatePost;
