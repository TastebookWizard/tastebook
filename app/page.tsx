'use client';

import Link from 'next/link';

import supabase from '@/lib/supabase/client';

import { useStore } from '@/lib/zustand/store';
import { UserSlice } from '@/lib/zustand/slices/userSlice';

import Button from "@/components/ui/Button";

export default function Home() {
  const user = useStore((state: UserSlice) => state);
  const logout = useStore((state: UserSlice) => state.logout);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      logout();
    }
    // You might want to add additional logic here, such as redirecting the user
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-y-8">
      <h1 className="font-semibold text-4xl text-center">This is the home page.</h1>
      <div className="flex flex-col items-center gap-4">
        <pre className="bg-gray-100 p-4 rounded-md">
          {JSON.stringify(user, null, 2)}
        </pre>
        {user.isLoggedIn ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <div className="flex gap-4">
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
