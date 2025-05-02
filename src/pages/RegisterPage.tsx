
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-agro-cream">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Join AgroConnect</h1>
            <p className="mt-2 text-gray-600">
              Create an account to map necessities or offer supplies
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
