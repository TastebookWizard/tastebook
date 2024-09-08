'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AuthForm from '@/components/layout/AuthForm';

const Auth = () => {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="w-full sm:w-1/2 flex flex-col">
        {/* Left side content */}
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="text-4xl font-semibold">Tastebook</div>
          </div>
        </div>

        {/* Auth form */}
        <div className="flex-grow flex justify-center items-center">
          <div className="w-full max-w-md space-y-4 p-8">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>
            <AuthForm isLogin={isLogin} />
            <div className="text-center">
              <span>
                {isLogin ? 'No account yet? ' : 'Already have an account? '}
              </span>
              <Link
                href={isLogin ? '/signup' : '/login'}
                className="text-rose-500 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-0.5 bg-gray-200 hidden sm:block"></div>
      <div className="w-full sm:w-1/2 bg-rose-500">
        {/* Right side content */}
        <div className="h-full flex flex-col justify-center items-center text-white p-8">
          <h1 className="text-4xl font-bold mb-6">Welcome to Tastebook</h1>
          <p className="text-xl mb-8 text-center">
            Discover, share, and savor delicious recipes from around the world.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">10k+</span>
              <span className="text-sm">Recipes</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">50k+</span>
              <span className="text-sm">Users</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">100+</span>
              <span className="text-sm">Countries</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">24/7</span>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="text-center">
            <p className="mb-4">Join our community today and start your culinary journey!</p>
            <Link href="/signup" className="bg-white text-rose-500 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
