import React from 'react';
import { FiCornerUpLeft, FiCornerRightUp, FiTrash2, FiArchive, FiInbox } from 'react-icons/fi';

const EmailDetails = ({ email }) => {
  if (!email) {
    return (
      <div className="email-details-column">
        <div className="empty-state">
          <div className="empty-icon"><FiInbox /></div>
          <h3>Select an email to read</h3>
          <p>Nothing is selected</p>
        </div>
      </div>
    );
  }

  // Get first letter of sender for avatar
  const avatarLetter = email.sender.charAt(0).toUpperCase();

  return (
    <div className="email-details-column animate-fade-in">
      <div className="details-header">
        <h2 className="details-subject">{email.subject}</h2>
        
        <div className="sender-info-row">
          <div className="sender-profile">
            <div className="avatar">{avatarLetter}</div>
            <div className="sender-details">
              <span className="sender-name-large">{email.sender}</span>
              <span className="recipient">to {email.recipient}</span>
            </div>
          </div>
          
          <div className="email-actions">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginRight: '1rem', alignSelf: 'center' }}>
              {email.fullDate}
            </span>
            <button className="action-btn" title="Reply">
              <FiCornerUpLeft />
            </button>
            <button className="action-btn" title="Forward">
              <FiCornerRightUp />
            </button>
            <button className="action-btn" title="Archive">
              <FiArchive />
            </button>
            <button className="action-btn delete" title="Delete">
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
      
      <div className="details-body">
        {email.content}
      </div>
      
      <div className="reply-section">
        <button className="reply-btn">
          <FiCornerUpLeft /> Reply
        </button>
      </div>
    </div>
  );
};

export default EmailDetails;
