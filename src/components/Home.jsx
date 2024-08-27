import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../features/articles/articleSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import CKEditorComponent from './CKEditorComponent';
import './css/home.css';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const { user, token } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [body, setBody] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  
  // State for modals and notifications
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateOrUpdateArticle = () => {
    if (editingArticle) {
      setShowUpdateModal(true); // Show the update confirmation modal
    } else {
      dispatch(createArticle({ title, body, subtitle, imageLink }))
        .then(() => {
          setNotificationMessage("Article created successfully!");
          setShowSuccessNotification(true);
          resetForm();
          setTimeout(() => setShowSuccessNotification(false), 3000);
        });
    }
  };

  const handleConfirmUpdate = () => {
    dispatch(updateArticle({ id: editingArticle.id, title, body, subtitle, imageLink }))
      .then(() => {
        setNotificationMessage("Article updated successfully!");
        setShowSuccessNotification(true);
        resetForm();
        setShowUpdateModal(false); // Hide the update confirmation modal
        setTimeout(() => setShowSuccessNotification(false), 3000);
      });
  };

  const handleDeleteArticle = (id) => {
    setArticleToDelete(id);
    setShowConfirmDeleteModal(true); // Show the delete confirmation modal
  };

  const handleConfirmDelete = () => {
    dispatch(deleteArticle(articleToDelete))
      .then(() => {
        setNotificationMessage("Article deleted successfully!");
        setShowSuccessNotification(true);
        setShowConfirmDeleteModal(false); // Hide the delete confirmation modal
        setArticleToDelete(null); // Reset the article to delete
        setTimeout(() => setShowSuccessNotification(false), 3000);
      });
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSubtitle(article.subtitle);
    setImageLink(article.imageLink);
    setBody(article.body);
  };

  const resetForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSubtitle('');
    setImageLink('');
    setBody('');
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Home Page!</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <h2>{editingArticle ? "Edit Article" : "Create a New Article"}</h2>
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

      {/* CKEditor component */}
      <CKEditorComponent data={body} setData={setBody} />
      
      <button className="submit-button" onClick={handleCreateOrUpdateArticle}>
        {editingArticle ? "Update" : "Submit"}
      </button>
      {editingArticle && <button className="cancel-button" onClick={resetForm}>Cancel</button>}

      <h2>Articles</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {articles && articles.map((article) => (
        <div className="article-card" key={article.id}>
          <h3>{article.title}</h3>
          {article.subtitle && <h4>{article.subtitle}</h4>}
          
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
          
          {article.imageLink && (
            <div className="article-image">
              <img src={article.imageLink} alt={article.title} />
            </div>
          )}
          <button className="edit-button" onClick={() => handleEditArticle(article)}>Edit</button>
          <button className="delete-button" onClick={() => handleDeleteArticle(article.id)}>Delete</button>
        </div>
      ))}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this article?</p>
            <button className="modal-confirm-button" onClick={handleConfirmDelete}>Yes</button>
            <button className="modal-cancel-button" onClick={() => setShowConfirmDeleteModal(false)}>No</button>
          </div>
        </div>
      )}

      {/* Confirm Update Modal */}
      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Save changes?</p>
            <button className="modal-confirm-button" onClick={handleConfirmUpdate}>Yes</button>
            <button className="modal-cancel-button" onClick={() => setShowUpdateModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
