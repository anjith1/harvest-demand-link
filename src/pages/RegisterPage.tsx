
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const navigate = useNavigate();
  
  useEffect(() => {
    // If there's no role parameter, check localStorage
    if (!role) {
      const selectedRole = localStorage.getItem('selectedRole');
      // If there's a selected role in localStorage, redirect to the register page with that role
      if (selectedRole) {
        navigate(`/register?role=${selectedRole}`, { replace: true });
      } else {
        // If there's no selected role, redirect to home to select a role
        navigate('/', { replace: true });
      }
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-agro-cream">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Join AgroConnect</h1>
            <p className="mt-2 text-gray-600">
              {role === 'farmer' ? 'Register as a Farmer/Supplier' : 
              role === 'admin' ? 'Register as an Administrator' : 
              'Register as a Consumer'}
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
