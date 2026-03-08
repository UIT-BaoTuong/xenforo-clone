import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      const accessToken = response.data.accessToken || response.data.token;
      const refreshToken = response.data.refreshToken;
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Gradient */}
      <div className="auth-bg"></div>

      {/* Logo Area */}
      <div className="auth-logo">
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
          <rect x="2" y="2" width="10" height="10" stroke="url(#gradient1)" strokeWidth="1.5" rx="2"/>
          <rect x="16" y="2" width="10" height="10" stroke="url(#gradient2)" strokeWidth="1.5" rx="2"/>
          <rect x="2" y="16" width="10" height="10" stroke="url(#gradient2)" strokeWidth="1.5" rx="2"/>
          <rect x="16" y="16" width="10" height="10" stroke="url(#gradient1)" strokeWidth="1.5" rx="2"/>
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="12" y2="12">
              <stop offset="0%" stopColor="#00D9FF"/>
              <stop offset="100%" stopColor="#B26FFF"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0" y1="0" x2="12" y2="12">
              <stop offset="0%" stopColor="#B26FFF"/>
              <stop offset="100%" stopColor="#00D9FF"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Xenforo</span>
      </div>

      <div className="auth-box login-box">
        <div className="auth-header">
          <h1>Đăng Nhập</h1>
          <p>Quay lại trang chủ của bạn</p>
        </div>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input 
              id="username"
              type="text" 
              name="username"
              placeholder="Nhập tên đăng nhập" 
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="input-focus"></div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              id="password"
              type="password" 
              name="password"
              placeholder="Nhập mật khẩu" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="input-focus"></div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản? <a href="#signup" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Đăng ký ngay</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;