import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetails from './components/EmailDetails';
import { categories, mockEmails } from './data/emails';
import './index.css';

function App() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle category change
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedEmailId(null);
    setSearchQuery('');
  };

  // Handle email click
  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    // Mark as read when opened
    if (email.unread) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, unread: false } : e
      ));
    }
  };

  // Calculate unread counts per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    emails.forEach(email => {
      if (email.unread) {
        counts[email.categoryId] = (counts[email.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [emails]);

  // Filter emails for the list
  const filteredEmails = useMemo(() => {
    let filtered = emails.filter(email => email.categoryId === selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.sender.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [emails, selectedCategory, searchQuery]);

  // Get currently selected email details
  const selectedEmail = useMemo(() => {
    return emails.find(email => email.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />
      
      <EmailList 
        emails={filteredEmails}
        selectedEmailId={selectedEmailId}
        onSelectEmail={handleSelectEmail}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      
      <EmailDetails email={selectedEmail} />
    </div>
  );
}

export default App;
