// UpdateConfirmationModal.jsx
import React from 'react';
import '../css/updateConfirmationModal.css'; // Ensure you create and style this CSS

function UpdateConfirmationModal({ actionType, onConfirm, onCancel }) {
  const getTitle = () => {
    if (actionType === 'save') {
      return 'Save Changes?';
    } else if (actionType === 'update') {
      return 'Confirm Update?';
    }
    return '';
  };

  const getMessage = () => {
    if (actionType === 'save') {
      return 'You have unsaved changes. Do you want to save them before leaving?';
    } else if (actionType === 'update') {
      return 'Do you want to update the post?';
    }
    return '';
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{getTitle()}</h3>
        <p>{getMessage()}</p>
        <button className="modal-confirm-button" onClick={onConfirm}>
          {actionType === 'save' ? 'Save' : 'Yes'}
        </button>
        <button className="modal-cancel-button" onClick={onCancel}>
          {actionType === 'save' ? 'Discard' : 'No'}
        </button>
      </div>
    </div>
  );
}

export default UpdateConfirmationModal;
