import React, { useEffect, useState } from 'react';
import axios from 'axios';

// DYNAMIC BACKEND URL: Uses live Render URL when deployed, defaults to localhost for Termux testing
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// CUSTOM REUSABLE BLACK CAT SVG LOGO COMPONENT
const BlackCatLogo = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 15px auto', display: 'block' }}>
    <path d="M12 2C9.5 2 7.5 4 7.1 6.5C5.3 7.2 4 9 4 11C4 13.2 5.5 15 7.5 15.7C8.2 18.2 10.5 20 13.2 20C16.5 20 19.2 17.5 19.5 14.2C20.4 13.5 21 12.3 21 11C21 8.8 19.2 7 17 7C16.7 7 16.5 7 16.2 7.1C15.5 4.1 12.9 2 12 2Z" fill="#1e1e24"/>
    <path d="M6 3L8.5 7.5H4.5L6 3Z" fill="#1e1e24"/>
    <path d="M14.5 2.5L16.5 7H12.5L14.5 2.5Z" fill="#1e1e24"/>
    <path d="M9 11.5C9.3 11.5 9.5 11.3 9.5 11C9.5 10.7 9.3 10.5 9 10.5C8.7 10.5 8.5 10.7 8.5 11C8.5 11.3 8.7 11.5 9 11.5Z" fill="#34a853"/>
    <path d="M14 11.5C14.3 11.5 14.5 11.3 14.5 11C14.5 10.7 14.3 10.5 14 10.5C13.7 10.5 13.5 10.7 13.5 11C13.5 11.3 13.7 11.5 14 11.5Z" fill="#34a853"/>
    <path d="M11.5 13H12.5L12 12.5L11.5 13Z" fill="#ff8a80"/>
  </svg>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [childData, setChildData] = useState(null);

  const mockUsers = {
    "parent01@school.com": { pass: "password123", code: "parent01" },
    "parent02@school.com": { pass: "password456", code: "parent02" }
  };

  const fetchNotifications = () => {
    axios.get(`${API_BASE_URL}/notifications`)
      .then(res => setNotifications(res.data))
      .catch(err => console.log('Notification fetch error:', err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers[email.toLowerCase().trim()];

    if (user && user.pass === password) {
      axios.get(`${API_BASE_URL}/api/parent/${user.code}`)
        .then(res => {
          setChildData(res.data);
          setIsLoggedIn(true);
          setLoginError('');
        })
        .catch(() => {
          setLoginError('Server connection failed. Is your backend active on Port 5000?');
        });
    } else {
      setLoginError('Invalid Credentials! Try: parent01@school.com / password123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setChildData(null);
  };

  const handleAnnouncement = (e) => {
    e.preventDefault();
    if (!message) return;

    axios.post(`${API_BASE_URL}/notifications`, { message })
      .then(() => {
        setMessage('');
        fetchNotifications();
      })
      .catch(err => console.log(err));
  };

  // --- VIEW 1: BLACK CAT THEME LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1e1e24', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ background: 'white', padding: '35px', borderRadius: '16px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <BlackCatLogo size={70} />
          <h1 style={{ color: '#1e1e24', margin: '0 0 5px 0', letterSpacing: '-0.5px' }}>Black Cat Portal</h1>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>Smart Classroom Parent Access</p>
          
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '13px' }}>Parent Email</label>
              <input 
                type="email" 
                placeholder="parent01@school.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '13px' }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', background: '#1e1e24', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(30,30,36,0.3)' }}>
              Secure Login
            </button>
          </form>

          {loginError && <p style={{ color: '#ea4335', marginTop: '15px', fontSize: '13px', fontWeight: '500' }}>⚠️ {loginError}</p>}
        </div>
      </div>
    );
  }

  // --- VIEW 2: PARENT DASHBOARD ---
  return (
    <div style={{ padding: '25px', fontFamily: 'sans-serif', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#1e1e24', padding: '15px 20px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'white', borderRadius: '50%', padding: '4px' }}>
            <BlackCatLogo size={35} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Black Cat System</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>Monitoring: <strong>{childData?.childName}</strong></p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: '#ff4757', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Logout 🚪
        </button>
      </div>
      
      {childData && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1e1e24' }}>📋 Student Core Metrics</h3>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>Classroom Assignment: <strong>{childData.grade}</strong></p>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', flex: '1', minWidth: '100px', textAlign: 'center', borderTop: '4px solid #2ed573' }}>
              <h5 style={{ margin: '0 0 5px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Attendance</h5>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#2ed573', fontSize: '18px' }}>{childData.status}</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', flex: '1', minWidth: '100px', textAlign: 'center', borderTop: '4px solid #1e1e24' }}>
              <h5 style={{ margin: '0 0 5px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Check In</h5>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#2f3542', fontSize: '18px' }}>{childData.checkInTime}</p>
            </div>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', flex: '1', minWidth: '100px', textAlign: 'center', borderTop: '4px solid #ffa502' }}>
              <h5 style={{ margin: '0 0 5px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Room Temp</h5>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#ffa502', fontSize: '18px' }}>{childData.classroomTemp}</p>
            </div>
          </div>

          <div style={{ marginTop: '25px', background: '#f1f2f6', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #1e1e24' }}>
            <h5 style={{ margin: '0 0 5px 0', color: '#1e1e24', fontSize: '14px', fontWeight: 'bold' }}>👩‍🏫 Teacher Notes & Guidelines</h5>
            <p style={{ margin: 0, fontSize: '14px', color: '#2f3542', fontStyle: 'italic', lineHeight: '1.5' }}>"{childData.teacherSuggestion}"</p>
          </div>

          <div style={{ marginTop: '25px' }}>
            <h5 style={{ margin: '0 0 12px 0', color: '#1e1e24', fontSize: '14px', fontWeight: 'bold' }}>📊 Academic Evaluation Records</h5>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', color: '#747d8c', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 5px' }}>Subject Domain</th>
                    <th style={{ padding: '10px 5px' }}>Assessment Identifier</th>
                    <th style={{ padding: '10px 5px' }}>Acquired Marks</th>
                    <th style={{ padding: '10px 5px' }}>Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {childData.exams?.map((exam, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f2f6', fontSize: '14px', color: '#2f3542' }}>
                      <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{exam.subject}</td>
                      <td style={{ padding: '12px 5px' }}>{exam.testName}</td>
                      <td style={{ padding: '12px 5px', color: '#2ed573', fontWeight: 'bold' }}>{exam.score}</td>
                      <td style={{ padding: '12px 5px', color: '#a4b0be' }}>{exam.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e1e24' }}>Broadcast Live Notice</h3>
        <form onSubmit={handleAnnouncement} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Type urgent parent bulletin..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '15px', outline: 'none' }}
          />
          <button type="submit" style={{ background: '#1e1e24', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            Broadcast
          </button>
        </form>
      </div>

      <h3 style={{ margin: '0 0 15px 0', color: '#1e1e24' }}>📌 Live Stream Notice Board</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {notifications.map((note, index) => (
          <li key={index} style={{ background: 'white', marginBottom: '12px', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', borderLeft: '6px solid #1e1e24' }}>
            <small style={{ color: '#a4b0be', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🕒 BULLETIN TIME: {note.time}</small>
            <span style={{ fontSize: '15px', color: '#2f3542' }}>{note.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
