import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import HomeTopbar from '../components/home/HomeTopbar';
import HomeSidebar from '../components/home/HomeSidebar';
import Feed from '../components/home/Feed';

import { isAuthenticated } from '../services/authService';

import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <main className="home-page">
      <div className="home-bg-circle home-bg-circle-one"></div>
      <div className="home-bg-circle home-bg-circle-two"></div>

      <HomeTopbar />
      <HomeSidebar />

      <div className="home-layout">
        <Feed />
      </div>
    </main>
  );
}

export default HomePage;