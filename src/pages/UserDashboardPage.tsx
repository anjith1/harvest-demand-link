
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserDashboard from '@/components/dashboard/UserDashboard';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    // Check user type
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.userType === 'admin') {
        navigate('/admin');
      } else if (parsedUser.userType === 'farmer') {
        navigate('/farmer');
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={true} 
        userType="user"
        onLogout={handleLogout}
      />
      
      <main className="flex-grow p-4 md:p-6 bg-agro-cream">
        <UserDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboardPage;
