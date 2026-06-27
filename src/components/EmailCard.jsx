import React from 'react';

const EmailCard = ({ email, isActive, onClick }) => {
  return (
    <div
      className={`email-card ${isActive ? 'active' : ''} ${email.unread ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div className="email-card-header">
        <span className="sender-name">{email.sender}</span>
        <span className="email-date">{email.date}</span>
      </div>
      <div className="email-subject">{email.subject}</div>
      <div className="email-preview">{email.preview}</div>
      
      {email.unread && <div className="unread-dot"></div>}
    </div>
  );
};

export default EmailCard;
