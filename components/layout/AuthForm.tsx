'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface AuthFormProps {
  isLogin: boolean;
}
const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [isClient, setIsClient] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [requirements, setRequirements] = useState({
    length: false,
    letterAndNumber: false,
    specialChar: false,
    upperAndLowerCase: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setRequirements({
      length: password.length >= 6,
      letterAndNumber: /[a-zA-Z]/.test(password) && /\d/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
      upperAndLowerCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    });
  }, [password]);

  const getRequirementColor = (met: boolean): string => {
    return met ? 'text-rose-500' : 'text-gray-400';
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!isLogin) {
      if (firstName.trim() === '') {
        newErrors.firstName = 'First name is required.';
      }
      if (lastName.trim() === '') {
        newErrors.lastName = 'Last name is required.';
      }
      if (username.trim() === '') {
        newErrors.username = 'Username is required.';
      }
      if (!Object.values(requirements).every(Boolean)) {
        newErrors.password = 'Password does not meet all requirements.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required.';
    }
    if (password.trim() === '') {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Proceed with form submission
      console.log('Form submitted successfully');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <>
          <h3 className="text-xl font-medium">Profile</h3>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Input
                type="text"
                placeholder="First Name"
                icon={<span className="far fa-user" aria-hidden="true"></span>}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={50}
              />
              {errors.firstName && <ErrorMessage message={errors.firstName} />}
            </div>
            <div className="w-1/2">
              <Input
                type="text"
                placeholder="Last Name"
                icon={<span className="far fa-user" aria-hidden="true"></span>}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={50}
              />
              {errors.lastName && <ErrorMessage message={errors.lastName} />}
            </div>
          </div>
          <div>
            <Input
              type="text"
              placeholder="Username"
              icon={<span className="far fa-at" aria-hidden="true"></span>}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />
            {errors.username && <ErrorMessage message={errors.username} />}
          </div>
        </>
      )}
      <h3 className="text-xl font-medium">Account</h3>
      <div>
        <Input
          type="email"
          placeholder="Email"
          icon={<span className="far fa-envelope" aria-hidden="true"></span>}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <ErrorMessage message={errors.email} />}
      </div>
      <div className="flex flex-col space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<span className="far fa-lock" aria-hidden="true"></span>}
        />
        {errors.password && <ErrorMessage message={errors.password} />}
        {isLogin && (
          <div className="flex justify-end">
            <Link href="#" className="text-sm text-rose-500 hover:underline">
              Forgot password?
            </Link>
          </div>
        )}
      </div>
      {!isLogin && (
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            icon={<span className="far fa-lock" aria-hidden="true"></span>}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword} />
          )}
        </div>
      )}
      {!isLogin && isClient && (
        <motion.ul
          className="text-sm mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.li
            className={getRequirementColor(requirements.length)}
            animate={{ color: requirements.length ? '#f43f5e' : '#9ca3af' }}
            transition={{ duration: 0.3 }}
          >
            <span className="fas fa-check mr-1" aria-hidden="true"></span> At
            least 6 characters
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.letterAndNumber)}
            animate={{
              color: requirements.letterAndNumber ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="fas fa-check mr-1" aria-hidden="true"></span>{' '}
            Contains both letters and numbers
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.specialChar)}
            animate={{
              color: requirements.specialChar ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="fas fa-check mr-1" aria-hidden="true"></span>{' '}
            Contains a special character
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.upperAndLowerCase)}
            animate={{
              color: requirements.upperAndLowerCase ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="fas fa-check mr-1" aria-hidden="true"></span>{' '}
            Contains both uppercase and lowercase letters
          </motion.li>
        </motion.ul>
      )}
      <div>
        <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
        {!isLogin && (
          <p className="text-sm text-gray-500 text-center mt-2">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-rose-500 hover:underline">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-rose-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        )}
      </div>
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
    </form>
  );
};

export default AuthForm;
