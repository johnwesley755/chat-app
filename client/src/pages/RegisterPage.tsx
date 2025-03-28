import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Chat Application
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;