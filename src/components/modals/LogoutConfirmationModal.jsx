// LogoutConfirmationModal.jsx
import React from 'react';
import '../css/logoutConfirmationModal.css'; // Ensure you create and style this CSS

function LogoutConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>
        <button className="modal-confirm-button" onClick={onConfirm}>
          Yes
        </button>
        <button className="modal-cancel-button" onClick={onCancel}>
          No
        </button>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
