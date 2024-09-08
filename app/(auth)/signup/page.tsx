import AuthForm from '@/components/layout/AuthForm';

export default function SignUp() {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <AuthForm isLogin={false} />
    </div>
  );
}
