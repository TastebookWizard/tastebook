import AuthForm from '@/components/layout/AuthForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <AuthForm isLogin={true} />
    </div>
  );
}
