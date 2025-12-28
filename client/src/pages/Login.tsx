import { LoginForm } from '@/components/login-form';

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-lg ">
        <LoginForm />
      </div>
    </div>
  );
}
