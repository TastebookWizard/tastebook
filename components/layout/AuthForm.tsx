'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';

import supabase from '@/lib/supabase/client';
import { useStore } from '@/lib/zustand/store';
import { UserSlice } from '@/lib/zustand/slices/userSlice';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const router = useRouter();

  const setUser = useStore((state: UserSlice) => state.setUser);

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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

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

  const checkCredentialsMutation = useMutation(
    async ({ username, email }: { username: string; email: string }) => {
      try {
        const { data: usernameData } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single();

        const { data: emailData } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        return {
          isUsernameTaken: !!usernameData,
          isEmailTaken: !!emailData,
        };
      } catch (error) {
        console.error('Error checking credentials:', error);
        throw error;
      }
    }
  );

  const signUpWithOtpMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        setOtpSent(true);
      },
      onError: (error) => {
        console.error('Error sending OTP:', error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: 'An error occurred while sending OTP. Please try again.',
        }));
      },
    }
  );

  const verifyOtpMutation = useMutation(
    async ({ email, otp }: { email: string; otp: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });
      if (error) throw error;
      return data;
    },
    {
      onSuccess: async () => {
        console.log('OTP verified successfully');
  
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const auth_id = user?.id;
  
        if (auth_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .insert([
                {
                  auth_id,
                  username,
                  email,
                  first_name: firstName,
                  last_name: lastName,
                },
              ])
              .select()
              .single();
  
            if (userError) throw userError;
  
            if (userData) {
              setUser({
                id: userData.id,
                authId: auth_id,
                isLoggedIn: true,
                username: userData.username,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
              });
  
              router.push('/');
            } else {
              throw new Error('User data not returned after insertion');
            }
          } catch (error) {
            console.error('Error creating user profile:', error);
            setErrors({ general: 'Failed to create user profile. Please try again.' });
          }
        } else {
          console.error('Unable to get user ID');
          setErrors({ general: 'Authentication failed. Please try again.' });
        }
      },
      onError: (error) => {
        console.error('Error verifying OTP:', error);
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      },
    }
  );

  const loginMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    {
      onSuccess: async (data) => {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', data.user?.id)
            .single();

          if (error) throw error;

          setUser({
            id: userData.id,
            authId: userData.auth_id,
            isLoggedIn: true,
            username: userData.username,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
          });

          router.push('/');
        } catch (error) {
          console.error('Error fetching user data:', error);
          setErrors({ general: 'Failed to fetch user data. Please try again.' });
        }
      },
      onError: (error: any) => {
        console.error('Error logging in:', error);
        if (error.message === 'Invalid login credentials') {
          setErrors({ general: 'Invalid email or password' });
        } else if (error.message === 'Email not confirmed') {
          setErrors({ general: 'Please verify your email before logging in' });
        } else {
          setErrors({ general: 'An error occurred. Please try again.' });
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (isLogin) {
      if (email.trim() === '') {
        newErrors.email = 'Email is required.';
      }
      if (password.trim() === '') {
        newErrors.password = 'Password is required.';
      }

      if (Object.keys(newErrors).length === 0) {
        loginMutation.mutate({ email, password });
      }
    } else {
      if (firstName.trim() === '') {
        newErrors.firstName = 'First name is required.';
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

      if (email.trim() === '') {
        newErrors.email = 'Email is required.';
      }
      if (password.trim() === '') {
        newErrors.password = 'Password is required.';
      }

      if (Object.keys(newErrors).length === 0) {
        try {
          const { isUsernameTaken, isEmailTaken } = await checkCredentialsMutation.mutateAsync({ username, email });

          if (isUsernameTaken) {
            newErrors.username = 'This username is already taken.';
          }
          if (isEmailTaken) {
            newErrors.email = 'This email is already in use.';
          }

          if (Object.keys(newErrors).length === 0) {
            signUpWithOtpMutation.mutate({ email, password });
          }
        } catch (error) {
          console.error('Error checking username and email:', error);
          newErrors.general = 'An error occurred while checking credentials. Please try again.';
        }
      }
    }

    setErrors(newErrors);
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyOtpMutation.mutate({ email, otp });
  };

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp('');
  };

  if (otpSent) {
    return (
      <form className="space-y-4" onSubmit={handleOtpSubmit} noValidate>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Enter OTP</h3>
          <p className="text-sm text-gray-600">
            We've sent a one-time password (OTP) to your email. Please enter it
            below to verify your account. The OTP will expire in 1 hour.
          </p>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter OTP"
            icon={<span className="far fa-key" aria-hidden="true"></span>}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {errors.otp && <ErrorMessage message={errors.otp} />}
        </div>
        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={verifyOtpMutation.isLoading}
            loading={verifyOtpMutation.isLoading}
          >
            Verify OTP
          </Button>
          <Button type="button" onClick={handleChangeEmail} variant="secondary">
            Change Email
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <>
          <div className="flex flex-col">
            <h3 className="text-xl font-medium">Profile</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
              <div className="w-full sm:w-1/2 flex flex-col">
                <div className="text-xs text-gray-500 mb-1">&nbsp;</div>
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
              <div className="w-full sm:w-1/2 flex flex-col">
                <div className="text-xs text-gray-500 mb-1">Optional</div>
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
          </div>
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Username"
                icon={<span className="far fa-at" aria-hidden="true"></span>}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
              />
            </div>
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
      {!isLogin && (
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
            {isClient && (
              <span className="fas fa-check mr-1" aria-hidden="true"></span>
            )}{' '}
            At least 6 characters
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.letterAndNumber)}
            animate={{
              color: requirements.letterAndNumber ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            {isClient && (
              <span className="fas fa-check mr-1" aria-hidden="true"></span>
            )}{' '}
            Contains both letters and numbers
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.specialChar)}
            animate={{
              color: requirements.specialChar ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            {isClient && (
              <span className="fas fa-check mr-1" aria-hidden="true"></span>
            )}{' '}
            Contains a special character
          </motion.li>
          <motion.li
            className={getRequirementColor(requirements.upperAndLowerCase)}
            animate={{
              color: requirements.upperAndLowerCase ? '#f43f5e' : '#9ca3af',
            }}
            transition={{ duration: 0.3 }}
          >
            {isClient && (
              <span className="fas fa-check mr-1" aria-hidden="true"></span>
            )}{' '}
            Contains both uppercase and lowercase letters
          </motion.li>
        </motion.ul>
      )}
      {errors.general && <ErrorMessage message={errors.general} />}
      <div>
        <Button
          type="submit"
          disabled={isLogin ? loginMutation.isLoading : (signUpWithOtpMutation.isLoading || checkCredentialsMutation.isLoading)}
          loading={isLogin ? loginMutation.isLoading : (signUpWithOtpMutation.isLoading || checkCredentialsMutation.isLoading)}
          variant="primary"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
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
