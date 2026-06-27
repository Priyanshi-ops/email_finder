import React from 'react';
import EmailCard from './EmailCard';
import SearchBar from './SearchBar';

const EmailList = ({ emails, selectedEmailId, onSelectEmail, searchQuery, onSearch }) => {
  return (
    <div className="email-list-column">
      <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
      
      <div className="list-header">
        <span>Inbox</span>
        <span>{emails.length} messages</span>
      </div>
      
      <div className="emails-container">
        {emails.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No emails found.</p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isActive={selectedEmailId === email.id}
              onClick={() => onSelectEmail(email)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
