import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const mockUsers = [
  { parentEmail: "parent01@school.com", pass: "password123", role: "parent" },
  { parentEmail: "parent02@school.com", pass: "password123", role: "parent" }
];

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [msgColor, setMsgColor] = useState('red');

  const fetchNotifications = async () => {
    const res = await fetch(`${API_BASE_URL}/api/notifications`);
    if (!res.ok) throw new Error('Server down');
    const data = await res.json();
    setNotifications(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const user = mockUsers.find(u => u.parentEmail === email.trim());

    if (user && user.pass === password) {
      try {
        await fetchNotifications();
        setIsLoggedIn(true);
        setRole(user.role);
      } catch (err) {
        // Fallback: If backend is offline, log in with mock data anyway
        setIsLoggedIn(true);
        setRole(user.role);
      }
    } else {
      setMsgColor('red');
      setLoginError('Invalid Credentials! Try: parent01@school.com / password123');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="dashboard-container" style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🏫 Smart Classroom Dashboard</h2>
        <p style={{ background: '#eef', padding: '10px', borderRadius: '5px' }}>Welcome back, <strong>{email}</strong>! (Role: {role})</p>
        
        <h3>📢 Recent Notifications</h3>
        {notifications.length === 0 ? (
          <div>
            <p style={{ color: '#666', fontStyle: 'italic' }}>No live server updates available. Showing offline mock alerts:</p>
            <ul style={{ background: '#fff9e6', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #ffcc00', listStyleType: 'none' }}>
              <li style={{ marginBottom: '10px' }}><strong>🔔 Attendance:</strong> Your child arrived safely at school at 8:15 AM.</li>
              <li><strong>📝 Homework:</strong> Math Assignment 4 is due tomorrow morning.</li>
            </ul>
          </div>
        ) : (
          <ul>
            {notifications.map((notif, index) => (
              <li key={index}><strong>{notif.title}:</strong> {notif.message}</li>
            ))}
          </ul>
        )}
        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '20px', padding: '10px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Log Out</button>
      </div>
    );
  }

  return (
    <div className="login-wrapper" style={{ padding: '40px 20px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '50px' }}>🐈‍⬛</div>
        <h2 style={{ margin: '10px 0 5px 0' }}>Black Cat Portal</h2>
        <p style={{ color: '#666', margin: 0 }}>Smart Classroom Parent Access</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Parent Email</label>
          <input 
            type="email" 
            placeholder="parent01@school.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Secure Login</button>
      </form>

      {loginError && (
        <p style={{ color: msgColor, textAlign: 'center', marginTop: '15px', fontSize: '14px', fontWeight: '500' }}>
          ⚠️ {loginError}
        </p>
      )}
    </div>
  );
}

export default App;
