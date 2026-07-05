import React, { useState, useMemo } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetails from './components/EmailDetails';
import { categories } from './data/emails';
import './index.css';

// Category detect karne ka logic
const detectCategory = (subject = '', from = '', snippet = '') => {
  const text = (subject + ' ' + from + ' ' + snippet).toLowerCase();
  
  if (/skin|serum|moistur|cream|beauty|glow|nykaa|mamaearth|sephora|kiehl|ordinary|spf|sunscreen/.test(text))
    return 'skincare';
  if (/job|hiring|career|interview|linkedin|naukri|recruiter|opening|vacancy|apply/.test(text))
    return 'jobs';
  if (/food|swiggy|zomato|ubereats|order|restaurant|craving|deliver/.test(text))
    return 'food';
  
  return 'skincare'; // default
};

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Gmail se emails fetch karo
  const fetchEmails = async (token) => {
    setLoading(true);
    try {
      // Step 1: Message IDs lo
      const listRes = await axios.get(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&labelIds=INBOX',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const messages = listRes.data.messages || [];

      // Step 2: Har message ki details fetch karo
      const emailDetails = await Promise.all(
        messages.map(async (msg, index) => {
          const detailRes = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const headers = detailRes.data.payload.headers;
          const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
          const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
          const date = headers.find(h => h.name === 'Date')?.value || '';
          const snippet = detailRes.data.snippet || '';
          const unread = detailRes.data.labelIds?.includes('UNREAD') || false;

          return {
            id: msg.id,
            categoryId: detectCategory(subject, from, snippet),
            sender: from.replace(/<.*>/, '').trim(),
            recipient: 'me',
            subject,
            preview: snippet,
            content: snippet,
            date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            fullDate: date,
            unread,
          };
        })
      );

      setEmails(emailDetails);
    } catch (err) {
      console.error('Email fetch error:', err);
      alert('Emails are fetching...');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      setIsLoggedIn(true);
      await fetchEmails(tokenResponse.access_token);
    },
    onError: () => alert('Login failed!'),
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  });

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedEmailId(null);
    setSearchQuery('');
  };

  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    if (email.unread) {
      setEmails(emails.map(e =>
        e.id === email.id ? { ...e, unread: false } : e
      ));
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    emails.forEach(email => {
      if (email.unread) {
        counts[email.categoryId] = (counts[email.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [emails]);

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

  const selectedEmail = useMemo(() => {
    return emails.find(email => email.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>📧 Email Dashboard</h1>
        <p style={{ color: '#666' }}>Apni Gmail se emails automatically sort karo</p>
        <button
          onClick={() => login()}
          style={{
            padding: '12px 24px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Login with Google please 
        </button>
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        ⏳ Emails fetching..
      </div>
    );
  }

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