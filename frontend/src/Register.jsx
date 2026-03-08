import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Đăng ký thất bại'
      });
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

      <div className="auth-box register-box">
        <div className="auth-header">
          <h1>Tạo Tài Khoản</h1>
          <p>Tham gia cộng đồng của chúng tôi</p>
        </div>

        {errors.submit && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
            </svg>
            {errors.submit}
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
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
            <div className="input-focus"></div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
            <div className="input-focus"></div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <div className="input-focus"></div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            <div className="input-focus"></div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo Tài Khoản'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Đã có tài khoản? <a href="#signin" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Đăng nhập</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
