import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './Web3Dashboard.css';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Web3Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const nodePerformanceData = [
    { time: '00:00', latency: 45, blocks: 120 },
    { time: '04:00', latency: 52, blocks: 145 },
    { time: '08:00', latency: 48, blocks: 132 },
    { time: '12:00', latency: 61, blocks: 210 },
    { time: '16:00', latency: 55, blocks: 180 },
    { time: '20:00', latency: 49, blocks: 155 },
    { time: '24:00', latency: 51, blocks: 168 }
  ];

  const networkStatsData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 92 },
    { name: 'Apr', value: 87 },
    { name: 'May', value: 110 },
    { name: 'Jun', value: 105 }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('accessToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="web3-dashboard">
        <div className="loading-screen">
          <div className="loader-circle"></div>
          <p>Initializing Node Service</p>
        </div>
      </div>
    );
  }

  return (
    <div className="web3-dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
            <span>BlockHub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">MAIN</p>
            <a href="#overview" className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10L10 2L18 10V17H12V13H8V17H2V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Dashboard</span>
            </a>
            <a href="#nodes" className={`nav-item ${activeTab === 'nodes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('nodes'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="4" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="10" cy="16" r="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10" y1="6" x2="10" y2="14" stroke="currentColor" strokeWidth="1"/>
                <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <span>Nodes</span>
            </a>
            <a href="#analytics" className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="3" y="10" width="3" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="8" y="6" width="3" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="13" y="4" width="3" height="12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>Analytics</span>
            </a>
          </div>

          <div className="nav-section">
            <p className="nav-label">MANAGEMENT</p>
            <a href="#settings" className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 3.5V2M10 18V16.5M16.5 10H18M2 10H3.5M14.5 14.5L15.8 15.8M4.2 4.2L5.5 5.5M14.5 5.5L15.8 4.2M5.5 15.8L4.2 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Settings</span>
            </a>
            <a href="#docs" className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 2H13V15H3V2ZM13 2H17V18H2V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1"/>
                <line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1"/>
                <line x1="5" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <span>Documentation</span>
            </a>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">{userProfile?.username?.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <p>{userProfile?.username || 'User'}</p>
              <span>Premium</span>
            </div>
          </div>
          <button className="logout-icon" onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 2H14V16H7M11 7L6 12L11 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p className="subtitle">Blockchain Node Service Analytics</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search nodes, analytics..." />
            </div>
            <button className="notification-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 8C5 5.24 7.24 3 10 3C12.76 3 15 5.24 15 8C15 14 18 17 18 17H2C2 17 5 14 5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="18" r="1" fill="currentColor"/>
              </svg>
              <span className="badge">2</span>
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="content">
          {/* Key Metrics */}
          <section className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <h3>Active Nodes</h3>
                <div className="metric-icon cyan">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="4" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="10" y1="6.5" x2="10" y2="17.5" stroke="currentColor" strokeWidth="1"/>
                    <line x1="6.5" y1="12" x2="13.5" y2="12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <div className="metric-value">42</div>
              <div className="metric-change positive">↑ 12% this week</div>
              <div className="metric-bar">
                <div className="bar-fill" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3>Network Uptime</h3>
                <div className="metric-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 6V12L16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="metric-value">99.98%</div>
              <div className="metric-change positive">↑ 0.02% today</div>
              <div className="metric-bar">
                <div className="bar-fill cyan-bg" style={{ width: '99.98%' }}></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3>Avg Latency</h3>
                <div className="metric-icon cyan">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12H22M12 2C16.4183 2 20 5.58172 20 10M12 22C16.4183 22 20 18.4183 20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="metric-value">52ms</div>
              <div className="metric-change positive">↓ 4ms optimal</div>
              <div className="metric-bar">
                <div className="bar-fill purple-bg" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3>Total Transactions</h3>
                <div className="metric-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M2 4H22V10H2V4Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 14H22V20H2V14Z" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1"/>
                    <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <div className="metric-value">2.4M</div>
              <div className="metric-change positive">↑ 340K today</div>
              <div className="metric-bar">
                <div className="bar-fill" style={{ width: '92%' }}></div>
              </div>
            </div>
          </section>

          {/* Charts Grid */}
          <section className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Node Performance (24h)</h3>
                <span className="chart-label">Latency & Block Production</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={nodePerformanceData}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1E2E" vertical={false}/>
                    <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: '12px' }}/>
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }}/>
                    <Tooltip contentStyle={{ backgroundColor: '#0A0B10', border: '1px solid #00D9FF', borderRadius: '8px' }}/>
                    <Area type="monotone" dataKey="latency" stroke="#00D9FF" fillOpacity={1} fill="url(#colorLatency)" isAnimationActive={true}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Network Growth</h3>
                <span className="chart-label">6-month trend</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={networkStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1E2E" vertical={false}/>
                    <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }}/>
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }}/>
                    <Tooltip contentStyle={{ backgroundColor: '#0A0B10', border: '1px solid #B26FFF', borderRadius: '8px' }}/>
                    <Bar dataKey="value" fill="#B26FFF" radius={[8, 8, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Activity & Status */}
          <section className="status-grid">
            <div className="status-card">
              <h3>Node Status</h3>
              <div className="status-list">
                <div className="status-item">
                  <div className="status-dot healthy"></div>
                  <div className="status-info">
                    <p className="status-name">Validator Node 1</p>
                    <span className="status-detail">Height: 18,450,234</span>
                  </div>
                  <span className="status-value">✓ Healthy</span>
                </div>
                <div className="status-item">
                  <div className="status-dot healthy"></div>
                  <div className="status-info">
                    <p className="status-name">Full Node 5</p>
                    <span className="status-detail">Height: 18,450,232</span>
                  </div>
                  <span className="status-value">✓ Healthy</span>
                </div>
                <div className="status-item">
                  <div className="status-dot warning"></div>
                  <div className="status-info">
                    <p className="status-name">Archive Node 3</p>
                    <span className="status-detail">Height: 18,450,200</span>
                  </div>
                  <span className="status-value">⚠ Syncing</span>
                </div>
                <div className="status-item">
                  <div className="status-dot healthy"></div>
                  <div className="status-info">
                    <p className="status-name">Light Node 2</p>
                    <span className="status-detail">Height: 18,450,234</span>
                  </div>
                  <span className="status-value">✓ Healthy</span>
                </div>
              </div>
            </div>

            <div className="status-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <p>Node sync completed</p>
                    <span>2 mins ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <p>Block #18,450,234 verified</p>
                    <span>5 mins ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon success">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <p>API endpoint healthy</p>
                    <span>12 mins ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon warning">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="12" r="1" fill="currentColor"/>
                      <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <p>High memory usage detected</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Web3Dashboard;
